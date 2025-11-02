"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ⏰ Reminder runs daily at 6 PM local time
const REMINDER_HOUR = 18;

export function CoachReminder() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  // ✅ Ask for notification permission on load
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => setPermission(perm));
    }
  }, []);

  // ✅ Check if attendance marked for today
  async function checkAttendanceAndNotify() {
    const today = new Date().toISOString().split("T")[0];

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("id, date")
      .eq("date", today);

    if (error) {
      console.error("Error fetching sessions:", error);
      return;
    }

    const { data: attendance, error: attErr } = await supabase
      .from("attendance")
      .select("id, session_id")
      .in(
        "session_id",
        sessions?.map((s) => s.id) ?? []
      );

    if (attErr) {
      console.error("Error fetching attendance:", attErr);
      return;
    }

    // 🔔 Trigger reminder only if sessions exist and no attendance yet
    if (sessions?.length && (!attendance || attendance.length === 0)) {
      triggerNotification();
    }
  }

  // ✅ Trigger local browser notification
  function triggerNotification() {
    if (permission === "granted") {
      new Notification("📋 Attendance Reminder", {
        body: "Hey Coach 👋, you haven’t marked attendance for today yet.",
        icon: "/icon.png",
      });
    } else {
      console.log("Notifications are blocked or not granted.");
    }
  }

  // ✅ Schedule daily check at 6 PM
  useEffect(() => {
    // check immediately when dashboard loads
    checkAttendanceAndNotify();

    const now = new Date();
    const target = new Date();
    target.setHours(REMINDER_HOUR, 0, 0, 0);

    let delay = target.getTime() - now.getTime();
    if (delay < 0) delay += 24 * 60 * 60 * 1000; // next day if past 6 PM

    const timeoutId = setTimeout(() => {
      checkAttendanceAndNotify();
      setInterval(checkAttendanceAndNotify, 24 * 60 * 60 * 1000); // repeat daily
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [permission]);

  return null; // silent background component
}
