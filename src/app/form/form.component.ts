import { Component, OnInit } from "@angular/core";
import { FormService } from "../services/form.service";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from "@angular/forms";
import { Observable } from "rxjs";
import { finalize, take, switchMap } from "rxjs/operators";
import {
  AngularFireStorage,
  AngularFireStorageReference
} from "@angular/fire/storage";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  isComplete: boolean = false;
  downloadUrl: string;
  uploadPercent: number;
  data: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  submitted: boolean = false;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.data = new FormGroup({
      fullname: new FormControl("", Validators.required),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ])
    });
  }

  uploadFile(event) {
    const { fileRef, task } = this.formService.uploadFile(event);

    task.percentageChanges().subscribe(percent => {
      this.isComplete = !this.isComplete;
      this.uploadPercent = percent;
    });
    task
      .snapshotChanges()
      .pipe(
        finalize(
          async () =>
            await fileRef.getDownloadURL().subscribe(url => {
              this.downloadUrl = url;
              console.log(this.downloadUrl);
              console.log(this.uploadPercent);
            })
        )
      )
      .subscribe();
  }

  submit() {
    this.submitted = !this.submitted;
    const data = {
      ...this.data.value,
      avatar: this.downloadUrl
    };
    if (this.data.invalid) {
      this.submitted = false;
      return;
    } else {
      this.formService.addData(data);
      this.resetFields();
    }
  }

  resetFields() {
    this.submitted = false;
    this.data.setValue({
      fullname: "",
      email: ""
    });
    const avatar: HTMLInputElement = document.querySelector("#avatar");
    const progress: HTMLElement = document.querySelector("#progress");
    avatar.value = "";
    progress.style.width = "0";
  }

  get fullname() {
    return this.data.get("fullname");
  }

  get email() {
    return this.data.get("email");
  }
}
