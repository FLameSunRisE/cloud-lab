package com.flamesunrises.todolistserver.service;

import com.flamesunrises.todolistserver.model.Todo;
import com.flamesunrises.todolistserver.repository.TodoRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

  private final TodoRepository todoRepository;

  public TodoService(TodoRepository todoRepository) {
    this.todoRepository = todoRepository;
  }

  public Todo getTodoById(Long id) {
    Optional<Todo> todoOptional = todoRepository.findById(id);
    return todoOptional.orElse(null);
  }
}