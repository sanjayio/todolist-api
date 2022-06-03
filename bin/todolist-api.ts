#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TodolistApiStack } from '../lib/todolist-api-stack';

const app = new cdk.App();
new TodolistApiStack(app, 'TodolistApiStack');
