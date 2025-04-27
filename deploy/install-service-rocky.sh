# Create the unit file
echo '[Service]

ExecStart=/home/rocky/simple-task-app/server/start.sh
Restart=always
RestartSec=2s

SyslogIdentifier=taskapp

User=root
Group=root

Environment=NODE_ENV=production PORT=5001

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/taskapp.service

# Reload daemons and start service
sudo systemctl daemon-reload
sudo systemctl start taskapp
sudo systemctl enable taskapp
sudo systemctl status taskapp -l