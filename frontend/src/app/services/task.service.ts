import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import { Observable } from 'rxjs';
import { List } from '../models/list.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webService: WebService) {}

  getLists(): Observable<List[]> {
    return this.webService.get('lists');
  }

  createList(payload: any): Observable<List> {
    return this.webService.post('lists', payload);
  }

  editList(listId: string, payload: any): Observable<any> {
    return this.webService.patch(`lists/${listId}`, payload);
  }

  deleteList(listId: string): Observable<any> {
    return this.webService.delete(`lists/${listId}`);
  }

  getTasks(listId: String) {
    return this.webService.get(`lists/${listId}/tasks`);
  }

  createTask(listId: string, payload: any): Observable<Task> {
    return this.webService.post(`lists/${listId}/tasks`, payload);
  }

  editTask(listId: string, taskId: string, payload: any): Observable<Task> {
    return this.webService.patch(`lists/${listId}/tasks/${taskId}`, payload);
  }

  deleteTask(listId: string, taskId: string): Observable<any> {
    return this.webService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  complete(
    listId: string,
    taskId: string,
    completed: boolean
  ): Observable<string> {
    return this.webService.patch(`lists/${listId}/tasks/${taskId}`, {
      completed: completed,
    });
  }
}
