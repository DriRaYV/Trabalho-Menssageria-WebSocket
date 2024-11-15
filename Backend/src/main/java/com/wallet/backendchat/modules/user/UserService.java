package com.wallet.backendchat.modules.user;

import com.wallet.backendchat.modules.user.model.User;
import com.wallet.backendchat.modules.user.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public Long registerUser(String username) {

        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            throw new DataIntegrityViolationException("O Usuário '" + username + "' já existe.");
        }

        User user = new User();
        user.setUsername(username);
        userRepository.save(user);
        return user.getId();
    }

    public Object authenticateUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return user.getId();
        }
        return null;
    }
    public User getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> getAllUsers(Long senderId) {
        return userRepository.getAllUsers(senderId);
    }



}
