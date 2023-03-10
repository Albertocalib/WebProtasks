import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoginService} from "./services/logIn.service";
import {signUpComponent} from "./SignUp/signUp.component";
import {logInComponent} from "./logIn/logIn.component";
import {AuthGuard} from "./AuthGuard";
import {MatCard, MatCardModule} from "@angular/material/card";
import {BoardService} from "./services/board.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {MainBoardComponent} from "./mainBoard/main.board.component";
import {AddElementDialogComponent} from "./AddElementDialog/add.element.dialog.component";
import {TaskListService} from "./services/tasklist.service";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {TaskService} from "./services/task.service";
import {BoardInsideComponent} from "./boardInside/board.inside.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {DeleteElementDialogComponent} from "./DeleteElementDialog/delete.element.dialog.component";
import {CopyOrMoveElementDialogComponent} from "./CopyOrMoveElementDialog/copyOrMove.element.dialog.component";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {TaskCardComponent} from "./taskCard/taskCard.component";
import {MatChipsModule} from "@angular/material/chips";
import {TagService} from "./services/tag.service";

@NgModule({
  declarations: [
    AppComponent,
    signUpComponent,
    logInComponent,
    MainBoardComponent,
    BoardInsideComponent,
    AddElementDialogComponent,
    DeleteElementDialogComponent,
    CopyOrMoveElementDialogComponent,
    TaskCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatGridListModule,
    DragDropModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatChipsModule
  ],
  providers: [LoginService,AuthGuard,BoardService,TaskListService,TaskService,TagService],
  bootstrap: [AppComponent]
})
export class AppModule { }
