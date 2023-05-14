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
import {SignUpComponent} from "./SignUp/signUp.component";
import {LogInComponent} from "./logIn/logIn.component";
import {AuthGuard} from "./AuthGuard";
import {MatCardModule} from "@angular/material/card";
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
import {MAT_DATE_LOCALE, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {TaskCardComponent} from "./taskCard/taskCard.component";
import {MatChipsModule} from "@angular/material/chips";
import {TagService} from "./services/tag.service";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {TaskDetailsDialog} from "./TaskDetailsDIalog/task.details.dialog.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ColorPickerModule} from "ngx-color-picker";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MessageService} from "./services/message.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FileExtensions} from "./file.model";


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    MainBoardComponent,
    BoardInsideComponent,
    AddElementDialogComponent,
    DeleteElementDialogComponent,
    CopyOrMoveElementDialogComponent,
    TaskCardComponent,
    TaskDetailsDialog
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
    MatChipsModule,
    NgxChartsModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    ColorPickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  providers: [LoginService,AuthGuard,BoardService,TaskListService,TaskService,TagService,MessageService,FileExtensions,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
