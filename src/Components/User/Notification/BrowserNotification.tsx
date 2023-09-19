import { useEffect } from "react";

function NotificationTool() {

    useEffect(() => {
        // Request permission for notifications
        Notification.requestPermission().then(function(permission) {
          console.log('Permission:', permission);
        });
    
        // Function to display a notification
        const showNotification = () => {
          if (Notification.permission === 'granted') {
            const options = {
              body: 'Hello', // Notification message
              icon: 'path_to_notification_icon.png', // Icon URL (optional)
            };
    
            const notification = new Notification('Notification Title', options);
          }
        };
    
        // Schedule to show the notification every 10 seconds
        const delayInMilliseconds = 10000; // 10 seconds
        const notificationInterval = setInterval(showNotification, delayInMilliseconds);
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(notificationInterval);
      }, []);
    





    return (
            <>
          
            </>
    )
}

export default NotificationTool

