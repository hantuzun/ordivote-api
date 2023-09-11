CREATE TABLE `blocks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(200),
	`type` int,
	`user_id` int,
	`label` varchar(200),
	CONSTRAINT `blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(120),
	`tagline` varchar(250),
	`display_name` varchar(250),
	`img_url` varchar(500),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `balance`;--> statement-breakpoint
DROP TABLE `block`;--> statement-breakpoint
DROP TABLE `brc20`;--> statement-breakpoint
ALTER TABLE `blocks` ADD CONSTRAINT `blocks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;