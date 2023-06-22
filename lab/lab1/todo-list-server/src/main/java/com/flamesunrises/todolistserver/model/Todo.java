package com.flamesunrises.todolistserver.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Data;

/**
 * Todo.
 *
 * @author jay
 * @version 1.0.0
 * @date 2023/06/22
 */
@Entity
@Data
public class Todo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;
  private boolean completed;
}