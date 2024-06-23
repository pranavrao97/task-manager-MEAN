import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { List } from 'src/app/models/list.model';
import { PageType } from 'src/app/models/task-manager.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-create-view',
  templateUrl: './create-view.component.html',
  styleUrls: ['./create-view.component.scss'],
})
export class CreateViewComponent implements OnInit, OnDestroy {
  title!: String;
  pageTitle!: String;
  buttonLabel!: String;
  pageType!: PageType;
  listId!: string;
  taskId!: string;

  createList$!: Subscription;
  updateList$!: Subscription;
  createTask$!: Subscription;
  updateTask$!: Subscription;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe({
      next: (data) => {
        const { listId, taskId } = data;
        this.listId = listId || '';
        this.taskId = taskId || '';
      },
    });
    this.router.data.subscribe({
      next: (data) => {
        this.pageTitle = data['title'];
        this.buttonLabel = data['action'];
        this.pageType = data['id'];
      },
    });
  }

  ngOnDestroy(): void {
    this.createList$?.unsubscribe();
    this.updateList$?.unsubscribe();
    this.createTask$?.unsubscribe();
    this.updateTask$?.unsubscribe();
  }

  navigateToPreviousPage() {
    this.route.navigate(['../'], { relativeTo: this.router });
  }

  onButtonClick() {
    switch (this.pageType) {
      case PageType.CREATE_LIST:
        this.createList$ = this.taskService
          .createList({ title: this.title })
          .subscribe({
            next: (data: List) => this.route.navigate([`/lists/${data._id}`]),
          });
        break;
      case PageType.UPDATE_LIST:
        this.updateList$ = this.taskService
          .editList(this.listId, { title: this.title })
          .subscribe({
            next: (data: List) =>
              this.route.navigate([`/lists/${this.listId}`]),
          });
        break;
      case PageType.CREATE_TASK:
        this.createTask$ = this.taskService
          .createTask(this.listId, { title: this.title })
          .subscribe({
            next: (data: Task) =>
              this.route.navigate([`/lists/${data._listId}`]),
          });
        break;
      case PageType.UPDATE_TASK:
        this.updateTask$ = this.taskService
          .editTask(this.listId, this.taskId, { title: this.title })
          .subscribe({
            next: (data: Task) =>
              this.route.navigate([`/lists/${this.listId}`]),
          });
        break;
      default:
        break;
    }
  }
}
