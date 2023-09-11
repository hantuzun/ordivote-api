CREATE TABLE `block` (
	`id` varchar(64) NOT NULL,
	`height` int NOT NULL,
	CONSTRAINT `block_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `bitcoin_block`;--> statement-breakpoint
ALTER TABLE `brc20` DROP FOREIGN KEY `brc20_block_height_bitcoin_block_height_fk`;
--> statement-breakpoint
CREATE INDEX `block_hash_index` ON `block` (`id`);--> statement-breakpoint
CREATE INDEX `block_height_index` ON `block` (`height`);--> statement-breakpoint
ALTER TABLE `brc20` ADD CONSTRAINT `brc20_block_height_block_height_fk` FOREIGN KEY (`block_height`) REFERENCES `block`(`height`) ON DELETE no action ON UPDATE no action;