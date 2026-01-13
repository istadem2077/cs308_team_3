package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.dto.Support.ChatMessageDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Support.CustomerContextDto;
import com.cs308_team_3.sabanci_pharmacy.entity.*;
import com.cs308_team_3.sabanci_pharmacy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired private ChatSessionRepository chatSessionRepository;
    @Autowired private ChatMessageRepository chatMessageRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private WishlistRepository wishlistRepository; // Added for context
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatSession initiateSession(String emailOrGuestId, boolean isRegistered) {
        User user = null;
        if (isRegistered) {
            Optional<User> userOpt = userRepository.findByEmail(emailOrGuestId);
            if (userOpt.isPresent()) user = userOpt.get();
        }

        ChatSession session = new ChatSession();
        session.setStatus("WAITING");
        session.setUser(user);
        if (!isRegistered) session.setGuestId(emailOrGuestId);
        
        ChatSession savedSession = chatSessionRepository.save(session);

        // Notify Agents via Queue Topic
        messagingTemplate.convertAndSend("/topic/support/queue", savedSession);

        return savedSession;
    }

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

        // Broadcast to specific chat session
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, messageDto);
        
        return savedMsg;
    }

    public CustomerContextDto getCustomerContext(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();
        Integer userId = user.getId();

        List<Order> orders = orderRepository.findByUserId(userId);
        int openOrdersCount = (int) orders.stream()
                .filter(o -> !o.getStatus().equalsIgnoreCase("DELIVERED") && !o.getStatus().equalsIgnoreCase("CANCELLED"))
                .count();

        String lastOrderStatus = orders.isEmpty() ? "N/A" : orders.get(orders.size() - 1).getStatus();

        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        int cartItemCount = cartOpt.map(cart -> cart.getItems().size()).orElse(0);

        // Add Wishlist Items
        List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
        List<String> wishlistItems = wishlist.stream()
                .map(w -> w.getProduct().getName()) // Assuming Wishlist has Product
                .collect(Collectors.toList());

	CustomerContextDto dto = new CustomerContextDto();

	dto.setCustomerName(user.getName());
	dto.setEmail(user.getEmail());
	dto.setOpenOrdersCount(openOrdersCount);
	dto.setLastOrderStatus(lastOrderStatus);
	dto.setCartItemCount(cartItemCount);
	
        return dto;
    }
    
    @Transactional
    public void claimSession(String sessionId, String agentEmail) {
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow();
        User agent = userRepository.findByEmail(agentEmail).orElseThrow();
        
        session.setAssignedAgent(agent);
        session.setStatus("ACTIVE");
        chatSessionRepository.save(session);
        
        ChatMessageDto systemMsg = new ChatMessageDto();
        systemMsg.setSessionId(sessionId);
        systemMsg.setSenderRole("SYSTEM");
        systemMsg.setContent("Agent " + agent.getName() + " has joined the chat.");
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, systemMsg);
    }
    
    public List<ChatSession> getActiveQueue() {
        return chatSessionRepository.findByStatus("WAITING");
    }

    public List<ChatSession> getAgentSessions(String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail).orElseThrow();
        return chatSessionRepository.findByAssignedAgentAndStatus(agent, "ACTIVE");
    }

    @Transactional
    public void resolveSession(String sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow();
        session.setStatus("CLOSED");
        chatSessionRepository.save(session);
        
        ChatMessageDto systemMsg = new ChatMessageDto();
        systemMsg.setSessionId(sessionId);
        systemMsg.setSenderRole("SYSTEM");
        systemMsg.setContent("Chat session ended.");
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, systemMsg);
    }
}
