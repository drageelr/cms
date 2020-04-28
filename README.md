# CCA Management System (CMS)
CMS is a **Task Management System** coupled with **Form Maker** to automate and ease **Data Management** and **Communication** between **CCA Users** and **Society Users.**
This product is tailor made for the **Co-curricular Activities Department** at **Lahore University of Management Sciences (LUMS).**

## Table Of Contents:
- [CCA Management System (CCA)](https://github.com/drageelr/cms/#cca-management-system-cms)
  - [Table Of Contents](https://github.com/drageelr/cms/#table-of-contents)
  - [Installation](https://github.com/drageelr/cms/#installation)
    - [Prerequisites](https://github.com/drageelr/cms/#prerequisites)
      - [Step 1 - Installing NGINX](https://github.com/drageelr/cms/#step-1---installing-nginx)
      - [Step 2 - Adjusting Firewall](https://github.com/drageelr/cms/#step-2---adjusting-firewall)
      - [Step 3 - Set Up Server Block](https://github.com/drageelr/cms/#step-3---set-up-server-block)
    - [Set Up CMS Using Deployer (For GitHub Contributors Only)](https://github.com/drageelr/cms/#set-up-cms-using-deployer---remote-server-for-github-contributors-only)
      - [Step 1 - Create SSH Key & Add To GitHub](https://github.com/drageelr/cms/#step-1---create-ssh-key--add-to-github)
      - [Step 2 - Set Up Deployer](https://github.com/drageelr/cms/#step-2---set-up-deployer)
      - [Step 3 - Deploy CMS](https://github.com/drageelr/cms/#step-3---deploy-cms)
    - [Set Up CMS Manually](https://github.com/drageelr/cms/#set-up-cms-manually---remote-server)
      - [Step 1 - Place Repository On Server](https://github.com/drageelr/cms/#step-1---place-repository-on-server)
      - [Step 2 - Run Commands To Deploy](https://github.com/drageelr/cms/#step-2---run-commands-to-deploy)

## Installation
**Note: This installation guide is for Ubuntu 18.04** 

### Prerequisites

1. [Install Node JS](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
2. [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
3. [Install PM2](https://pm2.keymetrics.io/)
4. Set Up NGINX - Follow the following steps (For Remote Server Deployement Only)

#### Step 1 - Installing NGINX
Run the following commands in terminal:
```
sudo apt update
sudo apt install nginx
```

#### Step 2 - Adjusting Firewall
Run the following command to get a list of application profiles:
```
sudo ufw app list
```
You should see the following output:
```
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```
**Note: For this guide, we will be using the HTTP profile**

Now run the following command to apply application profile:
```
sudo ufw allow 'Nginx HTTP'
```
You can very the change by typing:
```
sudo ufw status
```
This would give the following output:
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere                  
Nginx HTTP                 ALLOW       Anywhere                  
OpenSSH (v6)               ALLOW       Anywhere (v6)             
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
```

#### Step 3 - Set Up Server Block
Get public IP address by running the following command:
```
curl -4 icanhazip.com
```
This would give you your **global IP address.**

Now run the following commands from any directory:
```
sudo mkdir -p /var/www/<your_ip_address_here>/html
sudo chown -R $USER:$USER /var/www/<your_ip_address_here>/html
sudo chmod -R 755 /var/www/<your_ip_address_here>/html
```
Then by running the following command the configuration block will be edited:
```
sudo nano /etc/nginx/sites-available/<your_ip_address_here>
```
Copy paste the follwoing text in the editor and save the file:
```
server {
        listen 80;
        listen [::]:80;

        root /var/www/<your_ip_address_here>/html;
        index index.html index.htm index.nginx-debian.html;

        server_name <your_ip_address_here>;

        location /api {
                proxy_pass http://localhost:3030;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
        
        location /dev {
                proxy_pass http://localhost:3231;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
        
        location / {
                try_files $uri $uri/ =404;
        }
}
```
Now create a link between the file  and the directory `sites-enabled`:
```
sudo ln -s /etc/nginx/sites-available/<your_ip_address_here> /etc/nginx/sites-enabled
```
Make a minor change in Nginx's configuraiton file:
```
sudo nano /etc/nginx/nginx.conf
```
Find the following line:
```
#server_names_hash_bucket_size 64;
```
Uncomment the line by removing `#` in the start. Now save and close the file.

Check that there are no syntax errors in any Nginx file:
```
sudo nginx -t
```
If there aren't any problems, then restart Nginx by the following command:
```
sudo systemctl restart nginx
```

---

### Set Up CMS Using Deployer - Remote Server (For GitHub Contributors Only)

#### Step 1 - Create SSH Key & Add To GitHub
Run the following command in any directory:
```
ssh-keygen
```
Enter the following when prompted `Enter file in which to save the key`:
```
~/.ssh/id_cms_test
```
Now run the following command and copy the output:
```
cat ~/.ssh/id_cms_test
```
Go to [GitHub SSH and GPG Keys Setting](https://github.com/settings/keys) and press `New SSH key`. Paste there and press `Add SSH key` to save.

#### Step 2 - Set Up Deployer
Clone the repoistory and change deployer's directory by running the following commands in any directory:
```
mkdir ~/GitHub
git clone https://github.com/drageelr/cms.git
cp -r ~/GitHub/cms/deployer~/deployer
```
To configure deployer for your server edit 2 files,`dp-script-1` and `dp-script-2` , using `nano` text editor:
```
nano ~/deployer/resources/<file_name_here>
```
Replace the ip address `167.71.224.73` in both files with **your ip address** and save the file.

Now start the deployer by executing the following commands:
```
cd ~/deployer
npm install
pm2 start bin/www.js --name "cms-deployer"
```
To verify that the deployer is running, run command:
```
pm2 status
```

#### Step 3 - Deploy CMS
- Go to `http://<your_ip_address_here>/dev/site`
- Select `Branch` to deploy from and `Database` to run on.
- Press `Start Server` to deploy.
- Press `Refresh` to check status of server.

---


### Set Up CMS Manually - Remote Server

#### Step 1 - Place Repository On Server
- Place this repository on the server in the directory `~/GitHub`

#### Step 2 - Run Commands To Deploy
- Run the commands **(from root directory of the system)** in the text file `deployer/resources/dp-script-1` from line `2` - `8`
- Run the commands **(from root of this repository)** in the text file `deployer/resources/dp-script-2` from line `1` - `8`
- Run the command **(from server folder)** `pm2 start bin/www.js --name "cms-server"`

**Note: Make sure to replace the IP address `167.71.224.73` with your IP address**

---
