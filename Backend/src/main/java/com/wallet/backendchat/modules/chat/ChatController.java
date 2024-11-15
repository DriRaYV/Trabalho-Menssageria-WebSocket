package com.wallet.backendchat.modules.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wallet.backendchat.modules.chat.model.Message;
import com.wallet.backendchat.modules.chat.dto.MessageDTO;
import com.wallet.backendchat.modules.user.UserService;
import com.wallet.backendchat.modules.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Controller
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ChatController {

    @Autowired
    private SimpMessagingTemplate template;


    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private final ChatService chatService;
    private final UserService userService;

    @Autowired
    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "chat", groupId = "chatws")
    public void listenChatMessages(String message) {
        try {
            MessageDTO messageDTO = objectMapper.readValue(message, MessageDTO.class);

            String messageContent = messageDTO.getMessage();
            Long senderId = messageDTO.getSenderId();
            Long receiverId = messageDTO.getReceiverId();


            if (senderId != null) {
                User user = userService.getUserById(senderId);
                if (user != null) {
                    messageDTO.setSenderName(user.getUsername());
                }
            }

            if (senderId != null && receiverId != null) {
                chatService.saveMessageToDatabase(messageContent, senderId, receiverId);

                template.convertAndSend("/topic/private/" + receiverId, messageDTO);
                template.convertAndSend("/topic/private/" + senderId, messageDTO);
            } else {
                chatService.saveMessageToDatabase(messageContent, senderId);
                template.convertAndSend("/topic/messages", messageDTO);

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @KafkaListener(topics = "users", groupId = "chatws")
    public void listenUsers() {
        try {
            List<User> users = userService.getAllUsers();
            String usersJson = objectMapper.writeValueAsString(users);
            template.convertAndSend("/topic/users", usersJson);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @KafkaListener(topics = "writing", groupId = "chatws")
    public void listenWriting(String userId) {
        try {
            User user = userService.getUserById(Long.valueOf(userId));
            if (user != null) {
                template.convertAndSend("/topic/writing", user.getUsername() + " está digitando...");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @MessageMapping("/send")
    public void sendMessage(String message) throws Exception {
        MessageDTO messageDTO = objectMapper.readValue(message, MessageDTO.class);

        String messageJson = objectMapper.writeValueAsString(messageDTO);
        kafkaTemplate.send("chat", messageJson);
    }

    @MessageMapping("/writingUser")
    public void userWriting(@Payload String userId) throws Exception {
        kafkaTemplate.send("writing", userId);
    }

    @MessageMapping("/activeusers")
    public void getUsers() {
        try {
            kafkaTemplate.send("users", null);
        } catch (NumberFormatException e) {
            System.err.println("Formato inválido para senderId:");
        }
    }


    @GetMapping("/private/{recieverId}/{senderId}")
    public ResponseEntity<Object> getPrivateMessages(@PathVariable Long recieverId, @PathVariable Long senderId) {
        try {
            List<Message> privateMessages = chatService.getPrivateMessages(recieverId, senderId);
            return ResponseEntity.ok(privateMessages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/public")
    public ResponseEntity<Object> getAllPublicMessages() {
        try {
            List<Message> messages = chatService.getPublicMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}
