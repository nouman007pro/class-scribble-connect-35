
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
      console.log('Creating room:', roomCode, 'by:', teacherName);
      await setDoc(doc(db, 'rooms', roomCode), {
        roomCode,
        createdBy: teacherName,
        createdAt: Timestamp.now(),
        isActive: true
      });
      console.log('Room created successfully:', roomCode);
      return true;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Check if room exists
  async checkRoomExists(roomCode: string) {
    try {
      console.log('Checking if room exists:', roomCode);
      const roomDoc = await getDoc(doc(db, 'rooms', roomCode));
      const exists = roomDoc.exists() && roomDoc.data()?.isActive;
      console.log('Room exists and is active:', exists);
      return exists;
    } catch (error) {
      console.error('Error checking room:', error);
      return false;
    }
  },

  // Send a message
  async sendMessage(roomCode: string, userName: string, content: string, role: 'teacher' | 'student') {
    try {
      console.log('Sending message to room:', roomCode, 'from:', userName, 'role:', role);
      
      const messageData = {
        roomCode,
        userName,
        content,
        timestamp: Timestamp.now(),
        role
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);
      console.log('Message sent successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Listen to messages for a room (real-time)
  subscribeToMessages(roomCode: string, callback: (messages: ChatMessage[]) => void) {
    console.log('Setting up real-time message subscription for room:', roomCode);
    
    const q = query(
      collection(db, 'messages'),
      where('roomCode', '==', roomCode),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, 
      (querySnapshot) => {
        console.log('Firestore snapshot received with', querySnapshot.docs.length, 'messages for room:', roomCode);
        
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((docSnapshot) => {
          try {
            const data = docSnapshot.data();
            console.log('Processing message:', docSnapshot.id, data);
            
            const message: ChatMessage = {
              id: docSnapshot.id,
              roomCode: data.roomCode,
              userName: data.userName,
              content: data.content,
              timestamp: data.timestamp?.toDate() || new Date(),
              role: data.role || 'student'
            };
            messages.push(message);
          } catch (error) {
            console.error('Error processing message document:', error, docSnapshot.data());
          }
        });
        
        console.log('Processed', messages.length, 'messages for room:', roomCode);
        callback(messages);
      },
      (error) => {
        console.error('Error in message subscription for room:', roomCode, error);
        // Call callback with empty array to handle error state
        callback([]);
      }
    );
  },

  // Delete all messages for a room and deactivate room
  async deleteRoom(roomCode: string) {
    try {
      console.log('Deleting room:', roomCode);
      
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
      console.log('Deleted', deletePromises.length, 'messages for room:', roomCode);

      // Deactivate room
      await setDoc(doc(db, 'rooms', roomCode), {
        isActive: false
      }, { merge: true });
      
      console.log(`Room ${roomCode} deleted and deactivated`);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};
