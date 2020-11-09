-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `im_contacts`;
CREATE TABLE `im_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `friend_id` int(11) NOT NULL COMMENT '好友ID',
  `last_mess` varchar(255) NOT NULL COMMENT '最后一条信息',
  `unread_num` int(11) NOT NULL COMMENT '未读数量',
  `created_at` varchar(255) NOT NULL DEFAULT '2020-10-30 17:49:10',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  KEY `created_at` (`created_at`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `im_contacts` (`id`, `user_id`, `friend_id`, `last_mess`, `unread_num`, `created_at`) VALUES
(1,	1,	2,	'有点无聊哦',	0,	'2020-11-05 22:23:32'),
(23,	2,	1,	'有点无聊哦',	2,	'2020-11-05 22:23:32'),
(27,	3,	1,	'刘亦菲你想干嘛',	1,	'2020-10-29 22:50:50'),
(28,	1,	3,	'刘亦菲你想干嘛',	0,	'2020-10-29 22:50:50'),
(30,	1,	8,	'😘 😘 ',	0,	'2020-10-29 22:23:58'),
(31,	8,	1,	'😘 😘 ',	2,	'2020-10-29 22:23:58'),
(32,	4,	1,	'请不要发送垃圾信息',	1,	'2020-10-29 22:52:12'),
(33,	1,	4,	'请不要发送垃圾信息',	0,	'2020-10-29 22:52:12'),
(34,	1,	5,	'很神奇啊',	0,	'2020-11-05 19:49:05'),
(35,	5,	1,	'很神奇啊',	2,	'2020-11-05 19:49:05'),

DROP TABLE IF EXISTS `im_friends`;
CREATE TABLE `im_friends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '发用好友申请的用户id',
  `friend_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL COMMENT '发起人',
  `status` tinyint(4) NOT NULL COMMENT '0: 申请状态 | 1: 好友状态 | 2: 申请被拒 | 3: 已被对方移除',
  `remark` varchar(255) NOT NULL COMMENT '好友申请时的备注信息',
  `nick_remark` varchar(255) NOT NULL COMMENT '对friend_id的备注',
  `created_at` varchar(255) NOT NULL DEFAULT '2020-10-30 17:49:09',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  KEY `target_id` (`target_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `im_friends` (`id`, `user_id`, `friend_id`, `target_id`, `status`, `remark`, `nick_remark`, `created_at`) VALUES
(1,	1,	2,	1,	1,	'爽妹子，交个朋友啊！',	'小爽',	'2020-10-27 15:39:14'),
(2,	2,	1,	1,	1,	'我们已经是好友啦！',	'',	'2020-10-27 15:39:14'),
(3,	1,	3,	1,	1,	'神仙姐姐，加个好友啊！',	'神仙姐姐',	'2020-10-27 15:39:14'),
(4,	3,	1,	1,	1,	'好的啊',	'快看看',	'2020-10-27 15:39:14'),
(5,	1,	4,	1,	1,	'听说你是这一届的金鹰女神？',	'金鹰女神',	'2020-10-27 15:39:14'),
(6,	4,	1,	1,	1,	'怎样？',	'',	'2020-10-27 15:39:14'),
(7,	1,	5,	1,	1,	'圆圆女神',	'圆圆',	'2020-10-27 15:39:14'),
(8,	5,	1,	1,	1,	'Hi，你好，我是高圆圆',	'',	'2020-10-27 15:39:14'),
(9,	1,	6,	1,	1,	'小露思，最近挺火啊',	'小露思',	'2020-10-27 15:39:14'),
(10,	6,	1,	1,	1,	'一般般啦',	'',	'2020-10-27 15:39:14'),
(11,	7,	1,	7,	1,	'你好，通过一下，有事找你',	'',	'2020-10-27 15:39:14'),
(12,	8,	1,	8,	1,	'你好，通过一下，有事找你',	'',	'2020-10-27 15:39:14'),
(17,	1,	7,	7,	1,	'我们已经是好友啦，开始聊天吧！',	'阿里巴巴CEO',	'2020-10-27 15:39:14'),
(18,	1,	8,	8,	1,	'我们已经是好友啦，开始聊天吧！',	'万达董事长',	'2020-10-27 15:39:14'),
(20,	1,	9,	1,	0,	'你好，可以加个好友吗？',	'',	'2020-10-27 15:39:14'),
(22,	3,	9,	3,	0,	'你好',	'',	'2020-10-29 22:23:50'),

DROP TABLE IF EXISTS `im_message`;
CREATE TABLE `im_message` (
  `send_id` int(11) NOT NULL COMMENT '发送方id',
  `recv_id` int(11) NOT NULL COMMENT '接收方id',
  `message` varchar(255) NOT NULL COMMENT '消息内容',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` varchar(255) NOT NULL DEFAULT '2020-10-30 17:49:10',
  PRIMARY KEY (`id`),
  KEY `send_id` (`send_id`),
  KEY `recv_id` (`recv_id`),
  KEY `created_at` (`created_at`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `im_message` (`send_id`, `recv_id`, `message`, `id`, `created_at`) VALUES
(1,	3,	'这里会给出一段随机文本，可能包含一些链接，比如https://www.baidu.com，或者 www.baidu.com?from=onlineExam，如果出现链接文本，请给该链接文本加上链接标签，用户点击后能直接在新窗口中打开该链接',	76,	'2020-11-07 20:55:29'),
(1,	3,	'http://localhost:3000/#/',	77,	'2020-11-07 21:05:13'),
(1,	3,	'http://www.baidu.com?from=onlineExam',	78,	'2020-11-07 22:02:25'),
(1,	3,	'这里会给出一段随机文本，可能包含一些链接，比如 https://www.baidu.com ，或者 http://www.baidu.com?from=onlineExam，如果出现链接文本，请给该链接文本加上链接标签，用户点击后能直接在新窗口中打开该链接',	79,	'2020-11-07 22:02:46'),
(1,	3,	'tcp://192.168.0.101:8008 或者 http://192.168.0.101:8008',	80,	'2020-11-07 22:07:42');

DROP TABLE IF EXISTS `im_users`;
CREATE TABLE `im_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `area` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `autograph` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL DEFAULT '2020-10-30 17:49:09',
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`(191)),
  KEY `nickname` (`nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `im_users` (`id`, `username`, `nickname`, `password`, `avatar`, `status`, `area`, `mobile`, `autograph`, `created_at`) VALUES
(1,	'lmsail',	'M先生',	'e10adc3949ba59abbe56e057f20f883e',	'http://react-server.lmsail.com/avatar/2020-10-30/5cf2617f8c.jpeg',	1,	'江苏 淮安',	'18898987689',	'每一次的努力都是看得见的进步！',	'2020-10-27 15:39:03'),
(2,	'shuang',	'郑爽',	'e10adc3949ba59abbe56e057f20f883e',	'http://img1.imgtn.bdimg.com/it/u=1186528863,3178811360&fm=26&gp=0.jpg',	1,	'辽宁 沈阳',	'13265872146',	'不管你们怎么打击我,我都不会屈服的!!',	'2020-10-27 15:39:03'),
(3,	'liuyifei',	'刘亦菲',	'e10adc3949ba59abbe56e057f20f883e',	'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599725631785&di=222a2b16665394534032652c8b7234ea&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170828%2Fbca4530398cb45caa3101da954bc8a81.jpeg',	1,	'湖北 武汉',	'17680977960',	'努力朝着艺术家的方向走,我不想做肤浅的、昙花一现的明星',	'2020-10-27 15:39:03'),
(4,	'songqian',	'宋茜',	'e10adc3949ba59abbe56e057f20f883e',	'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4082095625,4197768517&fm=26&gp=0.jpg',	1,	'山东 青岛',	'18552421444',	'疼痛只是一瞬间的',	'2020-10-27 15:39:03'),
(5,	'gaoyuanyuan',	'高圆圆',	'e10adc3949ba59abbe56e057f20f883e',	'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3410711718,4003146871&fm=26&gp=0.jpg',	1,	'北京 丰台',	'13825525010',	'我是个极度不喜爱是非的人,所以我宁愿听不到,然后生活在自己的世界里,保持自己的清醒',	'2020-10-27 15:39:03'),
(6,	'zhaolusi',	'赵露思',	'e10adc3949ba59abbe56e057f20f883e',	'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2714458446,426719835&fm=26&gp=0.jpg',	1,	'四川 成都',	'17670635270',	'不知道！',	'2020-10-27 15:39:03'),
(7,	'mayun',	'马云',	'e10adc3949ba59abbe56e057f20f883e',	'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582778785114&di=4bf0a9cbe00cd200465af9fe46b3091e&imgtype=0&src=http%3A%2F%2Fwww.56ec.org.cn%2Fd%2Ffile%2Fnews%2Frwgd%2F2017-05-15%2Fa26c40ec7d83c66d78ad6f791952a01b.jpg',	1,	'浙江 杭州',	'13133803941',	'我对钱没有兴趣！你信吗？',	'2020-10-27 15:39:03'),
(8,	'wangjianlin',	'王健林',	'e10adc3949ba59abbe56e057f20f883e',	'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582778837077&di=f569a7c9412eae7b1068ee89ccc9aa9f&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20170709%2Fc266207e9ec74666b4dee5f74c634ae1_th.jpg',	1,	'四川 广元',	'15961628356',	'五个亿啊，不大！',	'2020-10-27 15:39:03'),
(9,	'lmsail1',	'王者荣耀',	'e10adc3949ba59abbe56e057f20f883e',	'http://react-server.lmsail.com/default/default-2.png',	1,	'',	'',	'',	'2020-10-27 15:39:03'),
(10,	'test1',	'好汉别走',	'e10adc3949ba59abbe56e057f20f883e',	'http://react-server.lmsail.com/default/default-4.png',	1,	'',	'',	'',	'2020-10-27 15:39:03'),
(11,	'test',	'test',	'16d7a4fca7442dda3ad93c9a726597e4',	'http://react-server.lmsail.com/default/default-4.png',	1,	'',	'',	'',	'2020-10-29 22:44:45'),
(12,	'花开花落',	'花开花落',	'e10adc3949ba59abbe56e057f20f883e',	'http://react-server.lmsail.com/default/default-5.png',	1,	'',	'',	'',	'2020-10-31 10:03:01'),

-- 2020-11-09 09:19:24
