CREATE TABLE `balance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`address` varchar(255) NOT NULL,
	`balance` int NOT NULL,
	`brc20_ticker` varchar(255),
	CONSTRAINT `balance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bitcoin_block` (
	`id` varchar(64) NOT NULL,
	`height` int NOT NULL,
	CONSTRAINT `bitcoin_block_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brc20` (
	`ticker` varchar(255) NOT NULL,
	`block_height` int,
	CONSTRAINT `brc20_ticker` PRIMARY KEY(`ticker`)
);
--> statement-breakpoint
CREATE INDEX `block_hash_index` ON `bitcoin_block` (`id`);--> statement-breakpoint
CREATE INDEX `block_height_index` ON `bitcoin_block` (`height`);--> statement-breakpoint
ALTER TABLE `balance` ADD CONSTRAINT `balance_brc20_ticker_brc20_ticker_fk` FOREIGN KEY (`brc20_ticker`) REFERENCES `brc20`(`ticker`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `brc20` ADD CONSTRAINT `brc20_block_height_bitcoin_block_height_fk` FOREIGN KEY (`block_height`) REFERENCES `bitcoin_block`(`height`) ON DELETE no action ON UPDATE no action;