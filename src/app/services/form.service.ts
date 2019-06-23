import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root"
})
export class FormService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `uploads/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return {
      task,
      fileRef
    };
  }

  addData(formData) {
    this.afs.collection("data").add(formData);
  }
}
