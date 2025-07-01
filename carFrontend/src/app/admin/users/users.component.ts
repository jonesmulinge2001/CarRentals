import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminUserService, User } from '../../services/admin-user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrl:'./users.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';

  // Modal handling
  selectedUser?: User;
  modalRef?: NgbModalRef;
  selectedRole: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER';
  pendingAction: 'DELETE' | 'PROMOTE' = 'DELETE';

  constructor(
    private userService: AdminUserService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.filteredUsers = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      },
    });
  }

  onSearch(term: string): void {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
  }

  openModal(content: TemplateRef<any>, user: User, action: 'DELETE' | 'PROMOTE'): void {
    this.selectedUser = user;
    this.pendingAction = action;
    this.selectedRole = user.role;
    this.modalRef = this.modalService.open(content, { centered: true, size: 'sm' });
  }

  confirmAction(): void {
    if (!this.selectedUser) return;

    if (this.pendingAction === 'DELETE') {
      this.userService.deleteUser(this.selectedUser.id).subscribe(() => {
        this.loadUsers();
        this.modalRef?.close();
      });
    } else if (this.pendingAction === 'PROMOTE') {
      this.userService.updateUserRole(this.selectedUser.id, this.selectedRole).subscribe(() => {
        this.loadUsers();
        this.modalRef?.close();
      });
    }
  }

  cancelModal(): void {
    this.modalRef?.dismiss();
  }
}
