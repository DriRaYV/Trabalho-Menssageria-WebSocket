package com.wallet.backendchat.modules.chat.dto;

public class MessageDTO {
    private String message;
    private Long senderId ;
    private Long receiverId ;
    private String senderName;
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "message='" + message + '\'' +
                ", senderId=" + senderId +
                ", receiverId=" + receiverId +
                ", senderName='" + senderName + '\'' +
                '}';
    }
}
