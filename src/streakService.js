import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getDayName() {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return days[new Date().getDay()];
}

function getWeekStartDate() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  today.setDate(today.getDate() + diff);
  return today.toISOString().split("T")[0];
}

function emptyWeek() {
  return {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };
}

export async function updateLoginStreak(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  const today = getTodayDate();
  const todayName = getDayName();
  const currentWeekStart = getWeekStartDate();

  if (!userSnap.exists()) {
    const week = emptyWeek();
    week[todayName] = true;

    await setDoc(userRef, {
      currentStreak: 1,
      longestStreak: 1,
      lastLoginDate: today,
      weekStartDate: currentWeekStart,
      weeklyLoginDays: week,
      updatedAt: new Date(),
    });
    return;
  }

  const data = userSnap.data();

  if (data.lastLoginDate === today) {
    return;
  }

  let weeklyLoginDays = data.weeklyLoginDays || emptyWeek();

  if (data.weekStartDate !== currentWeekStart) {
    weeklyLoginDays = emptyWeek();
  }

  weeklyLoginDays[todayName] = true;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = 1;

  if (data.lastLoginDate === yesterdayStr) {
    newStreak = (data.currentStreak || 0) + 1;
  }

  await updateDoc(userRef, {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, data.longestStreak || 0),
    lastLoginDate: today,
    weekStartDate: currentWeekStart,
    weeklyLoginDays,
    updatedAt: new Date(),
  });
}