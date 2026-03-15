resource "aws_db_instance" "postgres" {
  identifier     = "${var.project_name}-${var.environment}"
  engine         = "postgres"
  engine_version = "15"
  instance_class = "db.t3.micro"
  allocated_storage = 20

  db_name  = "personnel"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  publicly_accessible = false
  skip_final_snapshot = true
}

resource "aws_security_group" "rds" {
  vpc_id = var.vpc_id
  name   = "${var.project_name}-${var.environment}-rds"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}"
  subnet_ids = var.subnet_ids
}

variable "db_username" {
  sensitive = true
}

variable "db_password" {
  sensitive = true
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}