\c chat_db


CREATE TABLE users (
       id bigserial NOT NULL,
       username varchar(255) NOT NULL,
       CONSTRAINT users_pkey PRIMARY KEY (id),
       CONSTRAINT users_username_key UNIQUE (username)
);



CREATE TABLE messages (
      id bigserial NOT NULL,
      sender_id int8 NOT NULL,
      receiver_id int8 NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
      "content" varchar(255) NULL,
      receiver_name varchar(255) NULL,
      sender_name varchar(255) NULL,
      CONSTRAINT messages_pkey PRIMARY KEY (id),
      CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id),
      CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id)
);