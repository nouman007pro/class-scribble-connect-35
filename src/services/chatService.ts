
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
  Timestamp,
  setDoc,
  getDoc 
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

export interface Room {
  roomCode: string;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export const chatService = {
  // Create a room
  async createRoom(roomCode: string, teacherName: string) {
    try {
      await setDoc(doc(db, 'rooms', roomCode), {
        roomCode,
        createdBy: teacherName,
        createdAt: Timestamp.now(),
        isActive: true
      });
      return true;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Check if room exists
  async checkRoomExists(roomCode: string) {
    try {
      const roomDoc = await getDoc(doc(db, 'rooms', roomCode));
      return roomDoc.exists() && roomDoc.data()?.isActive;
    } catch (error) {
      console.error('Error checking room:', error);
      return false;
    }
  },

  // Send a message
  async sendMessage(roomCode: string, userName: string, content: string, role: 'teacher' | 'student') {
    try {
      const messageData = {
        roomCode,
        userName,
        content,
        timestamp: Timestamp.now(),
        role
      };

      await addDoc(collection(db, 'messages'), messageData);
    } catch (error) {
      console.error('Error sending message:', error);
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

    return onSnapshot(q, 
      (querySnapshot) => {
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const message: ChatMessage = {
            id: docSnapshot.id,
            roomCode: data.roomCode,
            userName: data.userName,
            content: data.content,
            timestamp: data.timestamp?.toDate() || new Date(),
            role: data.role || 'student'
          };
          messages.push(message);
        });
        
        callback(messages);
      },
      (error) => {
        console.error('Error in message subscription:', error);
        callback([]);
      }
    );
  },

  // Delete all messages for a room and deactivate room
  async deleteRoom(roomCode: string) {
    try {
      // Delete all messages
      const q = query(
        collection(db, 'messages'),
        where('roomCode', '==', roomCode)
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, 'messages', docSnapshot.id))
      );
      
      await Promise.all(deletePromises);

      // Deactivate room
      await setDoc(doc(db, 'rooms', roomCode), {
        isActive: false
      }, { merge: true });
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};
