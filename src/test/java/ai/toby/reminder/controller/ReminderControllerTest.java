package ai.toby.reminder.controller;

import ai.toby.reminder.domain.ReminderList;
import ai.toby.reminder.domain.ReminderListRepository;
import ai.toby.reminder.domain.ReminderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ReminderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private ReminderListRepository reminderListRepository;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
        reminderListRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/reminders - 리마인더를 생성하면 201과 생성된 리마인더를 반환한다")
    void create() throws Exception {
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "장보기"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.title").value("장보기"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    @DisplayName("POST /api/reminders - title이 없으면 400을 반환한다")
    void createWithBlankTitle() throws Exception {
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", ""))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/reminders - 전체 리마인더 목록을 반환한다")
    void findAll() throws Exception {
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "장보기"))))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "운동하기"))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/reminders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @DisplayName("GET /api/reminders/{id} - 특정 리마인더를 반환한다")
    void findById() throws Exception {
        String response = mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "장보기"))))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/api/reminders/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("장보기"));
    }

    @Test
    @DisplayName("GET /api/reminders/{id} - 존재하지 않으면 404를 반환한다")
    void findByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/reminders/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/reminders/{id} - 리마인더 제목을 수정한다")
    void update() throws Exception {
        String response = mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "장보기"))))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(put("/api/reminders/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "운동하기"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("운동하기"));
    }

    @Test
    @DisplayName("DELETE /api/reminders/{id} - 리마인더를 삭제하면 204를 반환한다")
    void deleteReminder() throws Exception {
        String response = mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "장보기"))))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(delete("/api/reminders/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/reminders/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PATCH /api/reminders/{id}/complete - 완료 상태를 토글한다")
    void toggleComplete() throws Exception {
        String response = mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "장보기"))))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(patch("/api/reminders/{id}/complete", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    @DisplayName("GET /api/reminders?listId - 해당 리스트의 리마인더만 반환한다")
    void findAllByListId() throws Exception {
        ReminderList list = reminderListRepository.save(new ReminderList("업무", "#007AFF", null, 0));
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "업무 리마인더", "listId", list.getId()))))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "리스트 없는 리마인더"))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/reminders").param("listId", list.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("업무 리마인더"))
                .andExpect(jsonPath("$[0].listId").value(list.getId()));
    }

    @Test
    @DisplayName("POST /api/reminders with listId - 응답에 listId가 포함된다")
    void createWithListId() throws Exception {
        ReminderList list = reminderListRepository.save(new ReminderList("업무", "#007AFF", null, 0));

        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("title", "회의 준비", "listId", list.getId()))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.listId").value(list.getId()));
    }
}
