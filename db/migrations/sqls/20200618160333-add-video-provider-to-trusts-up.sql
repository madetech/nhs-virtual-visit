ALTER TABLE trusts ADD video_provider varchar(255);

UPDATE trusts SET video_provider='whereby' WHERE video_provider IS NULL;

ALTER TABLE trusts ALTER COLUMN video_provider SET NOT NUll;
