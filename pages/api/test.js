/* eslint-disable import/no-unresolved */
import firebaseAdmin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
// const firebaseAdmin = require('firebase-admin');
// const firestore = require('firebase-admin/firestore');

if (!firebaseAdmin.apps?.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: `${process.env.NEXT_PUBLIC_PROJECT_ID}.firebaseapp.com`
  });
}

const db = getFirestore();

const getFullName = ({ name, surname }) =>
  (surname || '') + (surname && name ? ' ' : '') + (name || '');

const emptyUser = {
  phone: '',
  addresses: [],
  contractNumber: '',
  email: '',
  faces: [],
  name: '',
  surname: '',
  paidUntil: ''
};

export default async (req, res) => {
  try {
    const result = await db
      .collection('users')
      .where('phone', '==', '+78888888888')
      .get()
      .then((querySnapshot) => {
        let userInfo = null;
        querySnapshot.forEach((doc) => {
          userInfo = { ...emptyUser, ...doc.data() };
          userInfo.id = doc.id;
          userInfo.fullName = getFullName(userInfo);
        });
        return userInfo;
      });

    console.log('test result', result);
    res.status(200).send(result);
  } catch (err) {
    console.log('test error', err);
    res.status(err.responseCode || 500).send(err);
  }
};
