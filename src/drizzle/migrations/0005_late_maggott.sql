CREATE TABLE `globals` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`minimumNotMinedRequestedBlockHeight` int NOT NULL DEFAULT 2147483647,
	CONSTRAINT `globals_id` PRIMARY KEY(`id`)
);
