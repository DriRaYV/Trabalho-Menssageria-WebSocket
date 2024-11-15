package com.wallet.backendchat.modules.chat;

import com.wallet.backendchat.modules.chat.model.Message;
import com.wallet.backendchat.modules.chat.repository.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    @Autowired
    private MessageRepository messageRepository;


    public ChatService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Transactional
    public void saveMessageToDatabase(String content, Long senderId, Long receiverId) {
        Message message = new Message(content, senderId, receiverId);
        messageRepository.save(message);
    }

    @Transactional
    public void saveMessageToDatabase(String content, Long senderId) {
        Message message = new Message(content, senderId);
        messageRepository.save(message);
    }

    public List<Message> getPublicMessages() {
       return messageRepository.findAllPublicMessages();
    }

    public List<Message> getPrivateMessages(Long receiverId, Long senderId) {
        return messageRepository.findMessagesBySlug(receiverId, senderId);
    }

}
