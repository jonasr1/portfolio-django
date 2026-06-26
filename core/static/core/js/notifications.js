(function() {
    // ─── Configurations from Django ───
    var config = window.NOTIFICATION_MS_CONFIG || {};
    var MS_URL = config.url;
    var API_KEY = config.apiKey;
    var USER_ID = config.userId;
    var djangoAuthenticated = config.djangoAuthenticated;

    // Check localStorage if not authenticated via Django session
    var token = localStorage.getItem('access_token');
    if (!djangoAuthenticated && token) {
        // Decode JWT token to get user_id
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            var payload = JSON.parse(jsonPayload);
            USER_ID = payload.user_id;
        } catch (e) {
            console.error('Error decoding JWT token:', e);
        }
    }

    // Determine if we should show the bell
    var isAuthenticated = djangoAuthenticated || (token && USER_ID);

    var bellContainer = document.getElementById('bell-container');
    if (!isAuthenticated) {
        if (bellContainer) {
            bellContainer.style.display = 'none'; // Ensure it's hidden
        }
        return;
    }

    // Show the bell container
    if (bellContainer) {
        bellContainer.style.display = 'block';
    }

    // ─── DOM Elements ───
    var bellBtn = document.getElementById('bell-btn');
    var bellBadge = document.getElementById('bell-badge');
    var dropdown = document.getElementById('notif-dropdown');
    var notifList = document.getElementById('notif-list');
    var markAllBtn = document.getElementById('mark-all-read-btn');

    // If elements or config values are missing, abort
    if (!bellBtn || !bellBadge || !dropdown || !notifList || !MS_URL) {
        return;
    }

    // ─── Default headers for all requests ───
    var headers = {
        'X-Api-Key': API_KEY,
        'X-User-Id': USER_ID,
    };

    // ─── Function: Fetch unread count ───
    function fetchUnreadCount() {
        fetch(MS_URL + '/api/notifications/unread/', { headers: headers })
            .then(function(response) {
                if (!response.ok) throw new Error('API Error');
                return response.json();
            })
            .then(function(data) {
                var count = data.count;

                // Remove previous classes
                bellBadge.classList.remove('no-connection', 'no-messages');

                if (count === 0) {
                    bellBadge.textContent = '0';
                    bellBadge.classList.add('no-messages');
                    if (markAllBtn) {
                        markAllBtn.style.display = 'none';
                    }
                } else {
                    bellBadge.textContent = count;
                    if (markAllBtn) {
                        markAllBtn.style.display = 'inline-block';
                    }
                }
            })
            .catch(function() {
                // No connection to the microservice
                bellBadge.textContent = 'X';
                bellBadge.classList.remove('no-messages');
                bellBadge.classList.add('no-connection');
                if (markAllBtn) {
                    markAllBtn.style.display = 'none';
                }
            });
    }

    // ─── Function: Fetch notifications list ───
    function fetchNotifications() {
        fetch(MS_URL + '/api/notifications/', { headers: headers })
            .then(function(response) {
                if (!response.ok) throw new Error('API Error');
                return response.json();
            })
            .then(function(notifications) {
                if (notifications.length === 0) {
                    notifList.innerHTML = '<div class="notif-empty">No notifications.</div>';
                    return;
                }

                var html = '';
                notifications.forEach(function(notif) {
                    var className = notif.is_read ? 'notif-item' : 'notif-item unread';
                    var date = new Date(notif.created_at).toLocaleString('pt-BR');

                    html += '<div class="' + className + '" data-id="' + notif.id + '">';
                    if (notif.title) {
                        html += '  <div class="notif-title">' + notif.title + '</div>';
                    }
                    html += '  <div class="notif-message">' + notif.message + '</div>';
                    html += '  <div class="notif-date">' + date + '</div>';
                    html += '</div>';
                });

                notifList.innerHTML = html;

                // Add click event to mark as read
                var items = notifList.querySelectorAll('.notif-item.unread');
                items.forEach(function(item) {
                    item.addEventListener('click', function() {
                        var id = this.getAttribute('data-id');
                        markAsRead(id, this);
                    });
                });
            })
            .catch(function() {
                notifList.innerHTML = '<div class="notif-empty">Erro ao carregar notificações.</div>';
            });
    }

    // ─── Function: Mark notification as read ───
    function markAsRead(id, element) {
        fetch(MS_URL + '/api/notifications/' + id + '/read/', {
            method: 'PATCH',
            headers: headers,
        })
        .then(function(response) {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(function() {
            // Remove highlight
            element.classList.remove('unread');
            // Update unread count
            fetchUnreadCount();
        })
        .catch(function(error) {
            console.error('Error marking as read:', error);
        });
    }

    // ─── Function: Mark all notifications as read ───
    function markAllAsRead() {
        fetch(MS_URL + '/api/notifications/read-all/', {
            method: 'PATCH',
            headers: headers,
        })
        .then(function(response) {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(function() {
            // Update UI
            fetchUnreadCount();
            fetchNotifications();
        })
        .catch(function(error) {
            console.error('Error marking all as read:', error);
        });
    }

    // ─── Toggle dropdown ───
    bellBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var open = dropdown.classList.contains('open');

        if (open) {
            dropdown.classList.remove('open');
        } else {
            dropdown.classList.add('open');
            fetchNotifications();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdown.classList.remove('open');
    });

    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    if (markAllBtn) {
        markAllBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            markAllAsRead();
        });
    }

    // ─── Polling: fetch count every 5 seconds ───
    fetchUnreadCount();  // Immediate initial fetch
    setInterval(fetchUnreadCount, 5000);  // Every 5 seconds
})();
