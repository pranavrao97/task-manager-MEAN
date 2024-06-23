import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { List } from '../../models/list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: List[] = [];
  tasks: Task[] = [];
  listId!: string;

  constructor(
    private taskService: TaskService,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.router.params.subscribe((data) => {
      if (data['listId']) {
        this.listId = data['listId'];
        this.taskService.getTasks(this.listId).subscribe({
          next: (tasks: Task[]) => {
            this.tasks = tasks;
          },
        });
      } else {
        this.listId = '';
      }
    });
  }

  ngOnInit(): void {
    this.taskService.getLists().subscribe({
      next: (lists) => {
        this.lists = lists;
      },
    });
  }

  onTaskClick(task: Task) {
    this.taskService
      .complete(this.listId, task._id, !task.completed)
      .pipe(debounceTime(500))
      .subscribe({
        next: (data) => (task.completed = !task.completed),
      });
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.listId).subscribe({
      next: (res) => {
        this.route.navigate(['lists']);
      },
    });
  }

  onDeleteButtonClick(taskId: string): void {
    this.taskService.deleteTask(this.listId, taskId).subscribe({
      next: (res) => {
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
        this.route.navigate([`/lists/${this.listId}`]);
      },
    });
  }
}
