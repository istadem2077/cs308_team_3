package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Support.ChatMessageDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Support.CustomerContextDto;
import com.cs308_team_3.sabanci_pharmacy.entity.ChatSession;
import com.cs308_team_3.sabanci_pharmacy.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/session/init")
    public ChatSession initSession(@RequestParam(required = false) String email, 
                                   @RequestParam(required = false) String guestId) {
        boolean isRegistered = (email != null && !email.isEmpty());
        return chatService.initiateSession(isRegistered ? email : guestId, isRegistered);
    }

    @GetMapping("/context/{email}")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public CustomerContextDto getUserContext(@PathVariable String email) {
        return chatService.getCustomerContext(email);
    }

    @GetMapping("/queue")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public List<ChatSession> getQueue() {
        return chatService.getActiveQueue();
    }
    
    // NEW: Get sessions claimed by current agent
    @GetMapping("/my-sessions")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public List<ChatSession> getMySessions() {
        String agentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return chatService.getAgentSessions(agentEmail);
    }
    
    @PostMapping("/session/{sessionId}/claim")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public void claimSession(@PathVariable String sessionId, @RequestParam(required=false) String agentEmail) {
        // If agentEmail not provided in param, take from Context
        if(agentEmail == null) {
            agentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        chatService.claimSession(sessionId, agentEmail);
    }

    // NEW: Resolve/Close session
    @PutMapping("/session/{sessionId}/resolve")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public void resolveSession(@PathVariable String sessionId) {
        chatService.resolveSession(sessionId);
    }

    @MessageMapping("/chat/{sessionId}/sendMessage")
    public void sendMessage(@DestinationVariable String sessionId, @Payload ChatMessageDto chatMessage) {
        chatMessage.setSessionId(sessionId);
        chatService.saveAndSendMessage(sessionId, chatMessage);
    }
}
