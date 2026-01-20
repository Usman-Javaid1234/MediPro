'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader2, AlertTriangle, Users, Shield, ShieldOff, UserX, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminUsers, useUpdateUser, useMakeUserAdmin, useRevokeUserAdmin } from '@/lib/api/hooks/useAdmin';
import { UserResponse } from '@/lib/api/types';
import { useAuth } from '@/context/AuthContext';

const AdminUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: usersData, isLoading, error } = useAdminUsers({
    page,
    page_size: 20,
    search: searchQuery || undefined,
  });

  const updateUser = useUpdateUser();
  const makeAdmin = useMakeUserAdmin();
  const revokeAdmin = useRevokeUserAdmin();

  const users = usersData?.items || [];
  const totalPages = usersData?.total_pages || 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!confirm('Grant admin privileges to this user?')) return;
    try {
      await makeAdmin.mutateAsync(userId);
      toast({ title: 'Admin Granted', description: 'User is now an admin.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    if (!confirm('Revoke admin privileges from this user?')) return;
    try {
      await revokeAdmin.mutateAsync(userId);
      toast({ title: 'Admin Revoked', description: 'Privileges revoked.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (user: UserResponse) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.full_name || user.email}?`)) return;
    try {
      await updateUser.mutateAsync({ userId: user.id, data: { is_active: !user.is_active } });
      toast({ title: `User ${action}d`, description: `Account has been ${action}d.` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed', variant: 'destructive' });
    }
  };

  const isCurrentUser = (userId: string) => currentUser?.id === userId;

  return (
    <div className="p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex justify-center py-12 text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Failed to load users
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {(user.full_name || user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name || 'No name'}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_admin ? (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Shield className="w-3 h-3 mr-1" />Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline">User</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setIsDetailDialogOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!isCurrentUser(user.id) && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => user.is_admin ? handleRevokeAdmin(user.id) : handleMakeAdmin(user.id)} disabled={makeAdmin.isPending || revokeAdmin.isPending}>
                                  {user.is_admin ? <ShieldOff className="h-4 w-4 text-orange-500" /> : <Shield className="h-4 w-4 text-purple-500" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleToggleActive(user)} disabled={updateUser.isPending}>
                                  <UserX className={`h-4 w-4 ${user.is_active ? 'text-destructive' : 'text-green-600'}`} />
                                </Button>
                              </>
                            )}
                            {isCurrentUser(user.id) && <span className="text-xs text-muted-foreground px-2">You</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <span className="text-sm text-muted-foreground py-2">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">{(selectedUser.full_name || selectedUser.email).charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.full_name || 'No name'}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{selectedUser.phone || '-'}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p><Badge className={selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{selectedUser.is_active ? 'Active' : 'Inactive'}</Badge></div>
                <div><p className="text-sm text-muted-foreground">Role</p><Badge className={selectedUser.is_admin ? 'bg-purple-100 text-purple-800' : ''} variant={selectedUser.is_admin ? 'default' : 'outline'}>{selectedUser.is_admin ? 'Admin' : 'User'}</Badge></div>
                <div><p className="text-sm text-muted-foreground">Verified</p><Badge className={selectedUser.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>{selectedUser.is_verified ? 'Yes' : 'No'}</Badge></div>
                <div><p className="text-sm text-muted-foreground">Joined</p><p className="font-medium">{formatDate(selectedUser.created_at)}</p></div>
                <div><p className="text-sm text-muted-foreground">Updated</p><p className="font-medium">{formatDate(selectedUser.updated_at)}</p></div>
              </div>
              <p className="text-xs text-muted-foreground pt-4 border-t">ID: {selectedUser.id}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;