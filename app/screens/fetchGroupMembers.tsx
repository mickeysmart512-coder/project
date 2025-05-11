import { getFirestore, doc, getDoc } from 'firebase/firestore';

const fetchGroupMembers = async (groupId) => {
  const db = getFirestore();
  const groupDoc = await getDoc(doc(db, 'groups', groupId));
  
  if (groupDoc.exists()) {
    const groupData = groupDoc.data();
    const membersList = groupData.members;

    const members = await Promise.all(
      membersList.map(async (memberId) => {
        const memberDoc = await getDoc(doc(db, 'users', memberId));
        return memberDoc.exists() ? { ...memberDoc.data(), id: memberId } : null;
      })
    );

    return members.filter(member => member !== null);
  }

  return [];
};

export default fetchGroupMembers;
