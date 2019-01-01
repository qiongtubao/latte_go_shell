#!bin/bash

#npwd=$(cd "$(dirname "$0")";pwd);
# npwd=$(cd "$(dirname "$0")";pwd); 
npwd=`pwd`
cd /usr/local/bin
sudo rm -rf latteGo
#全局安装 latteJs
sudo ln -s $npwd/bin/latteGo latteGo
sudo chmod 777 latteGo

# cd $npwd