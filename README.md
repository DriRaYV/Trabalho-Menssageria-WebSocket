# Chat Integrado com Kafka, Spring Boot e React

Este guia ajudará você a configurar e executar o chat em tempo real utilizando Kafka, Spring Boot, e React.


**Feito por:**
- Arthur Barcala
- Helena Barbosa Costa
- Mirella Ayumi Miyakawa
- Rafaella Guimarães Venturini

## Requisitos

- **Docker** e **Docker Compose** instalados. Se você não tiver o Docker instalado, pode seguir o [guia oficial de instalação do Docker](https://docs.docker.com/get-docker/).
- **Java 17+** e **Maven** para o backend (Spring Boot).
- **Node.js** e **npm** para o frontend (React).

## Passo 1: Inicializando os containers com Docker Compose

1. Navegue até o diretório onde está localizado o arquivo `docker-compose.yml` no backend.

2. Execute o comando abaixo para iniciar os containers necessários para o Kafka, Zookeeper e PostgreSQL:

```bash
docker-compose up -d --build
```

Este comando irá baixar as imagens necessárias e iniciar os containers de **Zookeeper**, **Kafka** e **PostgreSQL** em segundo plano.

---

## Passo 2: Configurando o Projeto Frontend

1. Acesse o repositório do frontend (React).

2. No terminal, dentro do diretório do frontend, execute os seguintes comandos para instalar as dependências e iniciar o servidor:

```bash
npm install
npm start
```

O projeto estará acessível em `http://localhost:3000`.

## ATENÇÃO:
### A partir daqui já pode mandar as menssages. Um exemplo de funcionamento está no vídeo chamado 'funcionamento.mp4'. 
### Agora serão passadas as informações referentes ao backend.


---

# Backend Funcionamento - Spring Boot e Kafka

Você pode incluir uma explicação sobre as definições SQL em uma seção do guia para esclarecer a estrutura do banco de dados e como as tabelas são utilizadas. Aqui está um exemplo de como você pode integrar a explicação SQL:

---

## Estrutura do Banco de Dados

O banco de dados utilizado para este projeto contém duas tabelas principais: `users` e `messages`.

### Tabela `users`

A tabela `users` armazena informações sobre os usuários do sistema, com a seguinte definição:

```sql
CREATE TABLE users (
    id bigserial NOT NULL,
    username varchar(255) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_key UNIQUE (username)
);
```

#### Descrição dos campos:

- **id**: Identificador único para cada usuário, do tipo `bigserial`, que gera valores automaticamente.
- **username**: Nome de usuário único, do tipo `varchar(255)`, que deve ser único em todo o sistema. Este campo é utilizado para identificar os usuários de maneira exclusiva.
- **constraints**:
    - **users_pkey**: Define o campo `id` como chave primária.
    - **users_username_key**: Garante que o campo `username` seja único em todo o banco de dados.

### Tabela `messages`

A tabela `messages` armazena as mensagens enviadas entre os usuários. Sua definição é:

```sql
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
```

#### Descrição dos campos:

- **id**: Identificador único da mensagem, do tipo `bigserial`.
- **sender_id**: ID do usuário que enviou a mensagem. É uma chave estrangeira que referencia a tabela `users`.
- **receiver_id**: ID do usuário que receberá a mensagem. Este campo é opcional e pode ser `NULL` em caso de mensagens públicas.
- **created_at**: Data e hora em que a mensagem foi criada. O valor padrão é a data e hora atuais no momento da criação.
- **content**: Conteúdo da mensagem, armazenado como texto (`varchar(255)`).
- **receiver_name**: Nome do usuário que receberá a mensagem (para exibição no frontend).
- **sender_name**: Nome do usuário que enviou a mensagem (para exibição no frontend).
- **constraints**:
    - **messages_pkey**: Define o campo `id` como chave primária.
    - **messages_receiver_id_fkey**: Chave estrangeira que referencia a tabela `users` para o campo `receiver_id`.
    - **messages_sender_id_fkey**: Chave estrangeira que referencia a tabela `users` para o campo `sender_id`.

---

### Como o Banco de Dados é Usado

1. **Registro de Usuários**: Quando um novo usuário se registra, seu nome de usuário é inserido na tabela `users`, garantindo que o nome seja único.
2. **Envio de Mensagens**: As mensagens enviadas entre os usuários são armazenadas na tabela `messages`, onde o `sender_id` e o `receiver_id` referenciam os usuários que enviam e recebem as mensagens.
3. **Recuperação de Mensagens**: As mensagens podem ser recuperadas de duas formas:
    - **Mensagens privadas**: Baseadas no `sender_id` e `receiver_id`, para obter as mensagens trocadas entre dois usuários.
    - **Mensagens públicas**: Recuperadas sem restrição de usuário, permitindo que qualquer pessoa veja as mensagens postadas publicamente.

Este banco de dados permite a troca de mensagens em tempo real entre usuários registrados, e a integridade dos dados é garantida pelas chaves primárias e estrangeiras.

---

## Spring Boot API

### Rotas para **Usuários**:

- **POST /api/user/register**: Registra um novo usuário no sistema.
- **POST /api/user/login**: Realiza o login de um usuário.
- **GET /api/user/{senderId}**: Obtém todos os usuários, exceto o usuário com o `senderId` especificado.

`UserController`:

```java
@RestController
@RequestMapping("/api/user")
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
```

### Rotas para **Chat**:

- **POST /api/chat/send**: Envia uma mensagem para outro usuário ou um grupo.
- **GET /api/chat/private/{receiverId}/{senderId}**: Obtém todas as mensagens privadas entre dois usuários.
- **GET /api/chat/public**: Obtém todas as mensagens públicas.

`ChatController`:

```java
@Controller
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class ChatController {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private final ChatService chatService;
    private final UserService userService;

    @Autowired
    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @KafkaListener(topics = "chat", groupId = "chatws")
    public void listenChatMessages(String message) {
        // Processamento da mensagem recebida no Kafka
    }

    @MessageMapping("/send")
    public void sendMessage(String message) throws Exception {
        kafkaTemplate.send("chat", message);
    }

    @GetMapping("/private/{receiverId}/{senderId}")
    public ResponseEntity<Object> getPrivateMessages(@PathVariable Long receiverId, @PathVariable Long senderId) {
        List<Message> privateMessages = chatService.getPrivateMessages(receiverId, senderId);
        return ResponseEntity.ok(privateMessages);
    }

    @GetMapping("/public")
    public ResponseEntity<Object> getAllPublicMessages() {
        List<Message> messages = chatService.getPublicMessages();
        return ResponseEntity.ok(messages);
    }
}
```

### Integração com **Kafka**:

- Kafka é utilizado para enviar e escutar mensagens em tempo real.
- As mensagens de chat são enviadas para o tópico **chat** e consumidas pelos listeners.
- As mensagens são também enviadas aos usuários conectados via WebSockets.

### Tópicos Kafka

1. O tópico Kafka: `chat` é referente ao tópico de chats, privado e público.
2. O tópico Kafka: `users` é referente a lista de usuários.
3. O tópico Kafka: `writing` é referente aos usuários escrevendo.



A comunicação com Kafka é feita via `KafkaTemplate` e `KafkaListener`, permitindo que as mensagens sejam distribuídas de forma eficiente.

---
