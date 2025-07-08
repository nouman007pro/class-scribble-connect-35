
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  getDocs,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface ChatMessage {
  id: string;
  roomCode: string;
  userName: string;
  content: string;
  timestamp: Date;
  role: 'teacher' | 'student';
}

export const chatService = {
  // Send a message
  async sendMessage(roomCode: string, userName: string, content: string, role: 'teacher' | 'student') {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        roomCode,
        userName,
        content,
        timestamp: Timestamp.now(),
        role
      });
      console.log('Message sent with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error sending message: ', error);
      throw error;
    }
  },

  // Listen to messages for a room (real-time)
  subscribeToMessages(roomCode: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('roomCode', '==', roomCode),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          roomCode: data.roomCode,
          userName: data.userName,
          content: data.content,
          timestamp: data.timestamp.toDate(),
          role: data.role
        });
      });
      callback(messages);
    });
  },

  // Delete all messages for a room
  async deleteRoomMessages(roomCode: string) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('roomCode', '==', roomCode)
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, 'messages', docSnapshot.id))
      );
      
      await Promise.all(deletePromises);
      console.log(`All messages for room ${roomCode} deleted`);
    } catch (error) {
      console.error('Error deleting room messages: ', error);
      throw error;
    }
  }
};
