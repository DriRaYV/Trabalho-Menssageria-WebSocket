package com.wallet.backendchat.modules.chat.repository;

import com.wallet.backendchat.modules.chat.model.Message;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class MessageRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public void save(Message message) {
        entityManager.persist(message);
    }


        public List<Message> findAllPublicMessages() {
            try {
                TypedQuery<Object[]> query = entityManager.createQuery(
                        "SELECT m, sender.username, receiver.username " +
                                "FROM Message m " +
                                "LEFT JOIN users sender ON sender.id = m.senderId " +
                                "LEFT JOIN users receiver ON receiver.id = m.receiverId " +
                                "WHERE m.receiverId IS NULL", Object[].class
                );

                List<Object[]> results = query.getResultList();
                List<Message> messages = new ArrayList<>();

                for (Object[] result : results) {
                    Message message = (Message) result[0];
                    String senderName = (String) result[1];
                    String receiverName = (String) result[2];

                    message.setSenderName(senderName);
                    message.setReceiverName(receiverName);
                    messages.add(message);
                }
                return messages;
            } catch (NoResultException e) {
                return null;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }



    public List<Message> findMessagesBySlug(Long recieverId, Long senderId) {
        try {
            TypedQuery<Object[]> query = entityManager.createQuery(
                    "SELECT m, sender.username, receiver.username " +
                            "FROM Message m " +
                            "LEFT JOIN users sender ON sender.id = m.senderId " +
                            "LEFT JOIN users receiver ON receiver.id = m.receiverId " +
                            "WHERE (m.receiverId = :recieverId AND m.senderId = :senderId) OR (m.receiverId = :senderId AND m.senderId = :recieverId)", Object[].class
            ).setParameter("recieverId", recieverId).setParameter("senderId", senderId);

            List<Object[]> results = query.getResultList();
            List<Message> messages = new ArrayList<>();

            for (Object[] result : results) {
                Message message = (Message) result[0];
                String senderName = (String) result[1];
                String receiverName = (String) result[2];

                message.setSenderName(senderName);
                message.setReceiverName(receiverName);
                messages.add(message);
            }
            return messages;
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
