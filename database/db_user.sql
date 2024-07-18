INSERT INTO `passport` (`id`, `nation`, `expiration`) VALUES
('1', 'Vietnam', '2024-11-30');
-- ('PP656dfb28b089f', NULL, NULL);

INSERT INTO `user` (`id`, `name`, `sex`, `birthday`, `phone`, `email`, `nationality`, `passport_id`, `password`) VALUES
('1', 'Nguyễn Văn An', 'Male', '2013-11-01', '0123454321', 'nguyenvanan@gmail.com.vn', 'Vietnam', '1', '123456');
-- ('U656dfb28b0899', NULL, NULL, NULL, '0909000111', 'nguyenvanb@gmail.com', NULL, 'PP656dfb28b089f', '123456');