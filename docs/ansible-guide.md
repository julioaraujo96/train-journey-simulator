# Installing ansible

```sh
sudo apt update && sudo apt upgrade
sudo apt install ansible
sudo apt install python3-docker
ansible-galaxy collection install community.docker #(usually installed by default )
```

---

### Creating a inventory file.

Ansible reads this file to know the list of hosts and the ssh credentials. This can be just a list of ip addresses divided by new lines or something like this:

```yml
all:
  hosts:
    dev:
      ansible_connection: ssh
      ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
      ansible_host: 192.168.56.101
      ansible_user: vagrant
      ansible_ssh_pass: ubuntu
    prod:
      ansible_connection: ssh
      ansible_ssh_common_args: '-o StrictHostKeyChecking=no'
      ansible_host: 192.168.56.103
      ansible_user: ubuntu
      ansible_ssh_pass: ubuntu
```

We can target all hosts, we can target a specific host and we can do a task conditionally, that targets a specific hostname for example, with ` when: inventory_hostname == 'dev'`

### ansible.cfg

```
[defaults]

#path to inventory file
inventory = inventory

#remove some ansible deprecation warnings
deprecation_warnings = False

## the name of the remote user
remote_user=vagrant
```

To test connection we can do this command:
`ansible all -m ping --ask-pass -i /path/to/inventory`

### Modules

Ansible works by connecting to your nodes and pushing out scripts called “Ansible modules” to them. Most modules accept parameters that describe the desired state of the system. Ansible then executes these modules (over SSH by default), and removes them when finished. Your library of modules can reside on any machine, and there are no servers, daemons, or databases required.

Some of them are: copy, file, include, apt_repository, pip, docker

### Collections

Collections are a distribution format for Ansible content that can include playbooks, roles, modules, and plugins.

Some useful ones, are the `ansible.builtin`, that includes alot of functionalities, like `ansible.builtin.apt` for using the apt package manager in a linux distribution, `ansible.builtin.apt_repository`to add or remove apt repos from the machine, `community.docker`, a set of modules and plugins for working with docker.

### Structure of a IaC project

The approach recommended for a project like this, is to have a infra folder, where the inventory file and configuration files are located, you can also have a vagrantfile here to automatically setup a VM for testing purposes.

#### Playbooks

Then we should have a playbooks folder, where our ansible playbooks will run with the tasks we define. Inside this folder, we have yaml files that ansible will read and run instructions based on what we configure.

For example, we can have a `deploy.yml` file, that will deploy docker containers to the hosts.

```yaml
- name: Deploy Docker containers #name of what this instruction is responsible for
  hosts: all # hosts we want to target
  become: yes # execute tasks with sudo previleges
  roles: # roles we want to execute
    - common
    - docker
    - client
    - server
    - reverse-proxy
```

#### Roles/

Inside playbooks, we have a roles directory, so we can have our tasks more organized. Each folder in the roles directory is the role name, for example, docker for executing docker tasks like installing docker, run containers.

To define tasks we want to execute for that role, we define a folder tasks, `roles/docker/tasks`. Inside this tasks folder, we can have `main.yml` ansible looks for the main.yml file, (we can split files and include them in the main.yml aswell).

We should have this folders inside the folder created for our role:

- files
- tasks
- templates

Files should contain necessary files for ansible to send to the hosts, templates are for generic things that we will need to build like a configuration file or something that is built opon that template, Tasks is our set of instructions.

#### Tasks

We define here the ansible modules we want to use and what we want them to do, this will be executed on the defined hosts. We can refer to the ansible documentation for more information.

```yml
- name: Create app directory
  file:
    path: /home/{{ ansible_user }}/app/
    state: directory
    mode: '0755'

- name: Update and upgrade all packages to the latest version
  ansible.builtin.apt:
    update_cache: true
    upgrade: dist
    cache_valid_time: 3600
```
