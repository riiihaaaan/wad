# Case Study: Implementing NAT Gateway for Secure Internet Access

**Theory Assignment 3 — Question 2**
**Subject:** Web Application Development

---

## Question

A company needs its private EC2 instances to access the internet without being exposed. How should they configure NAT Gateway?

---

## Answer

### 1. Problem Overview

A company hosts its application on Amazon Web Services (AWS) using a Virtual Private Cloud (VPC). The infrastructure is divided into two subnets:

- **Public Subnet:** Contains web servers and load balancers that are accessible from the internet.
- **Private Subnet:** Contains application servers, backend services, and database instances (e.g., Amazon RDS) that must remain inaccessible from the internet for security reasons.

Despite being isolated, the private EC2 instances still require outbound internet connectivity for tasks such as:

- Downloading OS updates and security patches
- Communicating with third-party APIs (e.g., payment gateways)
- Pushing logs to external monitoring services
- Sending notifications via external services

**The core problem** is that assigning a public IP address to these instances would expose them to inbound connections from the internet, which is a significant security risk. The solution must allow outbound-only internet access without exposing the private instances.

---

### 2. Solution: NAT Gateway

The recommended solution is to deploy an **AWS NAT Gateway** (Network Address Translation Gateway). A NAT Gateway allows instances in a private subnet to initiate outbound connections to the internet while blocking any inbound connections initiated from outside.

**Characteristics of NAT Gateway:**

- It is a fully managed AWS service; no manual provisioning or patching is required.
- It is highly available within a single Availability Zone.
- It automatically scales to handle up to 100 Gbps of bandwidth.
- It requires an Elastic IP address (a static public IP) to operate.
- It must be deployed inside a **public subnet** (a subnet with a route to an Internet Gateway).

---

### 3. Architecture Overview

The architecture for this setup is structured as follows:

```
                        [ Internet ]
                             |
                   [ Internet Gateway (IGW) ]
                             |
          ----------------------------------------
          |                                      |
  [ Public Subnet 10.0.1.0/24 ]       [ Private Subnet 10.0.2.0/24   ]
  |  - Web Server (EC2)       |       |  - App Server (EC2)          |
  |  - NAT Gateway            |       |  - Database (RDS)            |
  |  - Elastic IP             |       |  - Backend Services          |
          |                                       |
          |____________ (outbound traffic) _______|
```

Key points in this architecture:

- The Internet Gateway is attached to the VPC and enables internet communication for the public subnet.
- The NAT Gateway resides in the public subnet and holds an Elastic IP address.
- Private subnet instances send outbound requests to the NAT Gateway, which forwards them to the internet.
- The internet cannot initiate a connection directly to any private instance.

---

### 4. Step-by-Step Configuration

#### Step 1: Create the VPC

```bash
aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=MyApp-VPC}]'
```

#### Step 2: Create Public and Private Subnets

```bash
# Public Subnet
aws ec2 create-subnet \
    --vpc-id vpc-0abc123 \
    --cidr-block 10.0.1.0/24 \
    --availability-zone us-east-1a

# Private Subnet
aws ec2 create-subnet \
    --vpc-id vpc-0abc123 \
    --cidr-block 10.0.2.0/24 \
    --availability-zone us-east-1a
```

#### Step 3: Create and Attach an Internet Gateway

The Internet Gateway connects the VPC to the internet and is required by the NAT Gateway.

```bash
aws ec2 create-internet-gateway

aws ec2 attach-internet-gateway \
    --internet-gateway-id igw-0xyz789 \
    --vpc-id vpc-0abc123
```

#### Step 4: Allocate an Elastic IP Address

The NAT Gateway requires a static public IP address to perform address translation.

```bash
aws ec2 allocate-address --domain vpc
# Output: AllocationId: eipalloc-0abc123def
```

#### Step 5: Create the NAT Gateway

The NAT Gateway must be placed in the **public subnet** with the allocated Elastic IP.

```bash
aws ec2 create-nat-gateway \
    --subnet-id subnet-0pub123 \
    --allocation-id eipalloc-0abc123def

# Wait for it to become available (approximately 2 to 3 minutes)
aws ec2 wait nat-gateway-available \
    --nat-gateway-ids nat-0xyz456
```

#### Step 6: Configure Route Tables

Two route tables must be configured — one for the public subnet and one for the private subnet.

**Public Subnet Route Table:**

```bash
aws ec2 create-route \
    --route-table-id rtb-0public123 \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id igw-0xyz789
```

**Private Subnet Route Table:**

```bash
aws ec2 create-route-table --vpc-id vpc-0abc123

aws ec2 create-route \
    --route-table-id rtb-0private789 \
    --destination-cidr-block 0.0.0.0/0 \
    --nat-gateway-id nat-0xyz456

aws ec2 associate-route-table \
    --route-table-id rtb-0private789 \
    --subnet-id subnet-0priv456
```

---

### 5. Route Table Summary

**Public Subnet Route Table:**

| Destination | Target      | Purpose                              |
| ----------- | ----------- | ------------------------------------ |
| 10.0.0.0/16 | local       | Internal VPC communication           |
| 0.0.0.0/0   | igw-0xyz789 | Route internet-bound traffic via IGW |

**Private Subnet Route Table:**

| Destination | Target      | Purpose                                      |
| ----------- | ----------- | -------------------------------------------- |
| 10.0.0.0/16 | local       | Internal VPC communication                   |
| 0.0.0.0/0   | nat-0xyz456 | Route internet-bound traffic via NAT Gateway |

**Important:** The private subnet route table must NOT contain a route to the Internet Gateway. Only the NAT Gateway route should be present for `0.0.0.0/0`. This enforces outbound-only internet access for private instances.

---

### 6. Security Configuration

#### Security Group Rules for Private EC2 Instances

| Direction | Protocol | Port Range | Source / Destination | Purpose                               |
| --------- | -------- | ---------- | -------------------- | ------------------------------------- |
| Inbound   | TCP      | 22         | 10.0.1.0/24          | SSH access from public subnet only    |
| Inbound   | TCP      | 3306       | 10.0.1.0/24          | Database access from internal servers |
| Outbound  | TCP      | 80         | 0.0.0.0/0            | HTTP for software updates             |
| Outbound  | TCP      | 443        | 0.0.0.0/0            | HTTPS for API calls                   |

#### Network ACL Rules for Private Subnet

| Rule Number | Direction | Protocol | Port Range | Source / Destination | Action |
| ----------- | --------- | -------- | ---------- | -------------------- | ------ |
| 100         | Inbound   | TCP      | 1024-65535 | 0.0.0.0/0            | ALLOW  |
| 110         | Inbound   | TCP      | 22         | 10.0.1.0/24          | ALLOW  |
| 100         | Outbound  | TCP      | 80         | 0.0.0.0/0            | ALLOW  |
| 110         | Outbound  | TCP      | 443        | 0.0.0.0/0            | ALLOW  |
| *           | Both      | All      | All        | 0.0.0.0/0            | DENY   |

---

### 7. NAT Gateway vs NAT Instance

| Feature          | NAT Gateway                           | NAT Instance                                       |
| ---------------- | ------------------------------------- | -------------------------------------------------- |
| Management       | Fully managed by AWS                  | Must be managed by the user                        |
| Availability     | Highly available within an AZ         | Requires manual failover configuration             |
| Scalability      | Auto-scales up to 100 Gbps            | Limited by EC2 instance type                       |
| Security Groups  | Cannot be associated                  | Can be associated                                  |
| Bastion Host Use | Not supported                         | Supported                                          |
| Port Forwarding  | Not supported                         | Supported via iptables                             |
| Recommendation   | Recommended by AWS for production use | Suitable only for specific or cost-sensitive cases |

---

### 8. Best Practices

1. **Deploy one NAT Gateway per Availability Zone** to ensure high availability. Configure each subnet's route table to use the NAT Gateway in the same AZ to avoid cross-AZ data transfer charges.
2. **Use VPC Endpoints** for AWS services such as S3 and DynamoDB. Traffic to these services through a VPC Endpoint does not pass through the NAT Gateway, reducing cost and latency.
3. **Enable VPC Flow Logs** to monitor and audit all traffic passing through the NAT Gateway for compliance and security analysis.
4. **Monitor CloudWatch metrics** such as `BytesOutToDestination`, `PacketsDropCount`, and `ErrorPortAllocation` to detect performance or configuration issues.
5. **Set billing alerts** using AWS Budgets to be notified of unexpected increases in NAT Gateway data transfer costs.

---

### 9. Cost Considerations

NAT Gateway pricing consists of two parts:

| Charge Type     | Rate (US East Region) | Description                                        |
| --------------- | --------------------- | -------------------------------------------------- |
| Hourly charge   | $0.045 per hour       | Applies for every hour the NAT Gateway is deployed |
| Data processing | $0.045 per GB         | Applies to all data processed through the gateway  |

A single NAT Gateway running continuously incurs approximately $32.40 per month in hourly charges alone, excluding data transfer costs. To minimize costs, route AWS service traffic through VPC Endpoints wherever possible.

---

### 10. Conclusion

The NAT Gateway is the appropriate and AWS-recommended solution for allowing private EC2 instances to access the internet without being exposed to inbound connections. By placing the NAT Gateway in a public subnet, assigning it an Elastic IP, and configuring the private subnet's route table to forward `0.0.0.0/0` traffic through it, the company achieves secure, outbound-only internet access.

The traffic flow can be summarized as follows:

```
Outbound (Private Instance to Internet):
  Private EC2 (10.0.2.x)
    --> Private Route Table (0.0.0.0/0 via NAT Gateway)
    --> NAT Gateway (translates private IP to Elastic IP)
    --> Internet Gateway
    --> Internet

Return Traffic (Internet to Private Instance):
  Internet
    --> Internet Gateway
    --> NAT Gateway (translates back to private IP)
    --> Private EC2 (10.0.2.x)

Blocked (Direct Inbound from Internet):
  Internet
    --> Internet Gateway
    --> No route exists to private subnet
    --> Connection refused
```

This configuration ensures that private instances remain isolated from direct internet exposure while retaining the ability to initiate outbound connections as required for operational tasks.
