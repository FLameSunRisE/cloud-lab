package com.flamesunrises.todolistserver.controller;

import com.flamesunrises.todolistserver.model.Todo;
import com.flamesunrises.todolistserver.repository.TodoRepository;
import com.flamesunrises.todolistserver.service.TodoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * TodoController.
 *
 * @author jay
 * @version 1.0.0
 * @date 2023/06/22
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/todos")
public class TodoController {

  @Autowired
  private TodoRepository todoRepository;
  @Autowired
  private TodoService todoService;

  @Autowired
  public TodoController(TodoRepository todoRepository) {
    this.todoRepository = todoRepository;
  }

  @GetMapping
  public List<Todo> getAllTodos() {
    return todoRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
    Todo todo = todoService.getTodoById(id);
    if (todo != null) {
      return ResponseEntity.ok(todo);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping
  public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
    return ResponseEntity.ok(todoRepository.save(todo));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
    Todo todo = todoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Invalid todo id: " + id));

    // 更新 todo 物件的屬性
    todo.setTitle(updatedTodo.getTitle());
    todo.setDescription(updatedTodo.getDescription());
    todo.setCompleted(updatedTodo.isCompleted());
    return ResponseEntity.ok(todoRepository.save(todo));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
    todoRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}