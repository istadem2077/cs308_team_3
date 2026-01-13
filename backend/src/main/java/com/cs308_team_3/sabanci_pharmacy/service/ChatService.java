package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Support.ChatMessageDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Support.CustomerContextDto;
import com.cs308_team_3.sabanci_pharmacy.entity.*;
import com.cs308_team_3.sabanci_pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 1. Initiate or Get Existing Session
    @Transactional
    public ChatSession initiateSession(String emailOrGuestId, boolean isRegistered) {
        // Simple logic: If registered, find active session by User ID, else create new
        User user = null;
        if (isRegistered) {
            Optional<User> userOpt = userRepository.findByEmail(emailOrGuestId);
            if (userOpt.isPresent()) {
                user = userOpt.get();
                // Check if this user already has an open session? (Optional logic)
            }
        }

        ChatSession session = new ChatSession();
        session.setStatus("WAITING");
        session.setUser(user);
        if (!isRegistered) {
            session.setGuestId(emailOrGuestId);
        }
        return chatSessionRepository.save(session);
    }

    // 2. Save and Broadcast Message
    @Transactional
    public ChatMessage saveAndSendMessage(String sessionId, ChatMessageDto messageDto) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        ChatMessage message = new ChatMessage();
        message.setSession(session);
        message.setSenderRole(messageDto.getSenderRole());
        message.setContent(messageDto.getContent());
        message.setAttachmentUrl(messageDto.getAttachmentUrl());
        
        ChatMessage savedMsg = chatMessageRepository.save(message);

        // Broadcast to specific topic based on role
        // Agents listen to /topic/public (or a queue), Customer listens to /queue/specific-session
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, messageDto);
        
        return savedMsg;
    }

    // 3. Get Customer Context (Auto-linking)
    public CustomerContextDto getCustomerContext(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();
        Integer userId = user.getId();

        // Fetch Open Orders
        List<Order> orders = orderRepository.findByUserId(userId);
        int openOrdersCount = (int) orders.stream()
                .filter(o -> !o.getStatus().equalsIgnoreCase("DELIVERED") && !o.getStatus().equalsIgnoreCase("CANCELLED"))
                .count();

        // Last Order Status
        String lastOrderStatus = orders.isEmpty() ? "N/A" : orders.get(orders.size() - 1).getStatus();

        // Cart Items Count
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        int cartItemCount = cartOpt.map(cart -> cart.getItems().size()).orElse(0);

        return new CustomerContextDto(
                user.getName(),
                user.getEmail(),
                openOrdersCount,
                lastOrderStatus,
                cartItemCount
        );
    }
    
    // 4. Agent Claims Session
    @Transactional
    public void claimSession(String sessionId, String agentEmail) {
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow();
        User agent = userRepository.findByEmail(agentEmail).orElseThrow();
        
        session.setAssignedAgent(agent);
        session.setStatus("ACTIVE");
        chatSessionRepository.save(session);
        
        // Notify participants
        ChatMessageDto systemMsg = new ChatMessageDto();
        systemMsg.setSessionId(sessionId);
        systemMsg.setSenderRole("SYSTEM");
        systemMsg.setContent("Agent " + agent.getName() + " has joined the chat.");
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, systemMsg);
    }
    
    public List<ChatSession> getActiveQueue() {
        return chatSessionRepository.findByStatus("WAITING");
    }
}
