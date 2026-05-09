export async function sendUpdatePublishedNotification(
  updateId: string,
  title: string,
  content: string,
  imageUrl?: string,
  category?: string
): Promise<{ success: boolean; message: string }> {
  return {
    success: true,
    message: "Notification will be sent by Cloud Function automatically",
  };
}
