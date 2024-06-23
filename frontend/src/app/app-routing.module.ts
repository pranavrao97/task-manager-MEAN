import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { CreateViewComponent } from './components/create-view/create-view.component';
import { PageType } from './models/task-manager.model';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: TaskViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  {
    path: 'lists/create-list',
    component: CreateViewComponent,
    data: {
      title: 'Create List',
      action: 'Create',
      id: PageType.CREATE_LIST,
    },
  },
  { path: 'lists/:listId', component: TaskViewComponent },
  {
    path: 'lists/:listId/create-task',
    component: CreateViewComponent,
    data: {
      title: 'Create Task',
      action: 'Create',
      id: PageType.CREATE_TASK,
    },
  },
  {
    path: 'lists/:listId/edit-list',
    component: CreateViewComponent,
    data: {
      title: 'Edit List',
      action: 'Update',
      id: PageType.UPDATE_LIST,
    },
  },
  {
    path: 'lists/:listId/tasks/:taskId/edit-task',
    component: CreateViewComponent,
    data: {
      title: 'Edit Task',
      action: 'Update',
      id: PageType.UPDATE_TASK,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
