package com.wallet.backendchat.modules.user;

import com.wallet.backendchat.modules.user.dto.UserDTO;
import jakarta.ws.rs.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody UserDTO userDTO) {
        try {
            Long user = userService.registerUser(userDTO.getUsername());
            return ResponseEntity.ok(user);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred."+ e.getMessage());
        }
    }


    @PostMapping("/login")
    public Object login(@RequestBody UserDTO userDTO) {
        try {
            return userService.authenticateUser(userDTO.getUsername());
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/{senderId}")
    public Object getAllUsers(@PathVariable Long senderId) {
        try {
            return userService.getAllUsers(senderId);
        } catch (Exception e) {
            return false;
        }
    }
}
