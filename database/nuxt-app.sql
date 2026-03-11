/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80045
 Source Host           : localhost:3306
 Source Schema         : nuxt-app

 Target Server Type    : MySQL
 Target Server Version : 80045
 File Encoding         : 65001

 Date: 11/03/2026 19:02:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 0: 禁用, 1: 启用',
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '角色：admin/user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2b$10$w/Y/aiDEhqqN5O3e4RGrBuOMWGGDvNBTx13dqZZepzLdR4eYKZ8x6', '管理员', 'https://api.dicebear.com/7.x/notionists/svg?seed=admin', 1, 'admin', '2026-03-09 12:16:44', '2026-03-11 17:45:11');
INSERT INTO `users` VALUES (2, 'admin1', '$2b$10$w/Y/aiDEhqqN5O3e4RGrBuOMWGGDvNBTx13dqZZepzLdR4eYKZ8x6', '管理员1', 'https://api.dicebear.com/7.x/notionists/svg?seed=admin1', 1, 'user', '2026-03-11 17:25:54', '2026-03-11 09:50:46');

SET FOREIGN_KEY_CHECKS = 1;
