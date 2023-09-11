CREATE TABLE `balance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`address` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`ticker` varchar(255) NOT NULL,
	`block_height` int NOT NULL,
	CONSTRAINT `balance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `block` (
	`id` varchar(64) NOT NULL,
	`height` int NOT NULL,
	CONSTRAINT `block_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `blocks`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
CREATE INDEX `address_index` ON `balance` (`address`);--> statement-breakpoint
CREATE INDEX `block_height_index` ON `balance` (`block_height`);--> statement-breakpoint
CREATE INDEX `block_hash_index` ON `block` (`id`);--> statement-breakpoint
CREATE INDEX `block_height_index` ON `block` (`height`);