import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Admin } from '../../models/post';
import { FormsModule } from '@angular/forms';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzInputModule,
    NzPopconfirmModule,
    NzTableModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  templateUrl: './adminTable.html',
  styleUrl: './adminTable.scss'
})
export class AdminComponent implements OnInit {

  admins: Admin[] = [];
  editCache: { [key: number]: { edit: boolean; data: Admin } } = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllAdmins();
  }

  getAllAdmins(): void {
    this.authService.getAllUsers().subscribe({
      next: (admins) => {
        this.admins = admins;
      },
      error: (error) => {
        console.log('Error while fetching admins', error);
      }
    });
  }

  deleteAdmin(id: number): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.admins = this.admins.filter(admin => admin.id !== id);
  
        },
        error: (error) => {
          console.log('Failed to delete admin', error);
        }
      });
    }
  }
  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.admins.findIndex(admin => admin.id === id);
    if (index > -1) {
      this.editCache[id] = {
        data: { ...this.admins[index] },
        edit: false
      };
    }
  }

  saveEdit(id: number): void {
    const index = this.admins.findIndex(admin => admin.id === id);
    if (index > -1) {
      // Update local array
      Object.assign(this.admins[index], this.editCache[id].data);
      this.editCache[id].edit = false;

      // Optional: call API to persist changes
      // this.authService.updateUser(this.admins[index]).subscribe({
      //   next: () => console.log('Admin updated successfully'),
      //   error: (err) => console.log('Failed to update admin', err)
      // });
    }
  }

  trackById(index: number, item: Admin): number {
    return item.id;
  }
}
