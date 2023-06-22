package com.flamesunrises.todolistserver.repository;

import com.flamesunrises.todolistserver.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
  // 自定義的查詢方法...
}
