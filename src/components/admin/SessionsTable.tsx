import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ChatSession {
  id: string;
  roomId: string;
  userId: string;
  businessContext: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  roomId: string;
  userId: string;
  businessContext?: string;
  createdAt: string;
}

const SessionsTable = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMessagesDialogOpen, setIsMessagesDialogOpen] = useState(false);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [page]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/admin/sessions?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
      
      const data = await response.json();
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chat sessions');
      setLoading(false);
      console.error('Error fetching chat sessions:', err);
    }
  };

  const fetchSessionMessages = async (sessionId: string) => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/admin/sessions/${sessionId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch session messages');
      }
      
      const data = await response.json();
      setSessionMessages(data.messages);
      setLoadingMessages(false);
    } catch (err) {
      console.error('Error fetching session messages:', err);
      setLoadingMessages(false);
      setSessionMessages([]);
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/chat/session/${selectedSession.roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete chat session');
      }
      
      // Remove session from the list
      setSessions(sessions.filter(session => session.id !== selectedSession.id));
      setIsDeleteDialogOpen(false);
      setSelectedSession(null);
    } catch (err) {
      console.error('Error deleting chat session:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete chat session');
    }
  };

  const handleViewMessages = (session: ChatSession) => {
    setSelectedSession(session);
    setIsMessagesDialogOpen(true);
    fetchSessionMessages(session.id);
  };

  if (loading && sessions.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading chat sessions...</div>;
  }

  if (error && sessions.length === 0) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Business Context</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No chat sessions found
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.roomId.substring(0, 8)}...</TableCell>
                  <TableCell>{session.userId}</TableCell>
                  <TableCell>{session.businessContext}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${session.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {session.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(session.lastActivity).toLocaleString()}</TableCell>
                  <TableCell>{new Date(session.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewMessages(session)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedSession(session);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chat session
              and all associated messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>