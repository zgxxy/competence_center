FROM registry.szlanyou.com/library/nginx:1.18.0-alpine


#配置apk阿里云镜像地址
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# 安装bash
RUN apk add --allow-untrusted bash \
      bash-doc \
      bash-completion \
      && rm -rf /var/cache/apk/*

RUN mkdir /eshop

# 全局准备
#RUN yum install vim make -y

#WORKDIR /eshop/app
USER root

#RUN yarn

COPY ./powerWeb ./eshop/powerWeb
# COPY --from=builder /home/node/app/dist ./eshop/app/trycar/dist
RUN chmod 775 -R /eshop

COPY ./nginx/nginx.conf  /etc/nginx
COPY ./nginx/power.conf  /etc/nginx
RUN mkdir /etc/nginx/vhost;\
mkdir /etc/nginx/logs;\
chmod 775 -R /etc/nginx
# 虚拟主机vhost 配置
COPY ./nginx/eshop.conf  /etc/nginx/vhost
#CMD ["npm", "run", "build"]
#RUN echo "daemon off;" >> /etc/nginx/nginx.conf
ENTRYPOINT ["/usr/sbin/nginx","-g","daemon off;"]
CMD ["-g","daemon off;"]